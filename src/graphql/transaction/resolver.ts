import { Resolver, Mutation, Arg, Authorized, Ctx, Query } from 'type-graphql';
import { initPayment, verifyPayment } from '../../config/paystack';
import { UserInputError, ForbiddenError } from 'apollo-server-express';
import {
    Transaction,
    TransactionModel,
    PaymentDirection,
    paymentStatus,
} from '../../models/Transaction';
import { VoteCostModel } from '../../models/VoteCost';
import { ConfirmInput, TransactionInput } from './input';
import utils from '../../utils';
import { WalletModel } from '../../models/Wallet';
import { userModelUidQuery } from '../../utils/userModelUidQuery';
const { firebase } = utils;

Authorized();
@Resolver(() => Transaction)
export class TransactionResolver {
    @Mutation(() => Transaction)
    async initializePayment(
        @Arg('input') { vote, voteCostId, callback_url }: TransactionInput,
        @Ctx('token') token: string
    ) {

        try {


            const { uid, email } = await firebase.admin.auth().verifyIdToken(token);
            if (!email) throw new Error('No email attached to this account');

            const user = await userModelUidQuery(uid)

            // get proper amount
            const voteCost = await VoteCostModel.findById(voteCostId);
            if (!voteCost) throw new UserInputError('No vote per cost with the given id');

            const amount = vote * voteCost.costPerVote * 100;

            const newTransaction = await TransactionModel.create({
                email,
                userId: user._id,
                voteCostId,
                amount,
                direction: PaymentDirection.OUTGOINGPAYMENT,
                vote,
            });

            const { success, data: initInfo } = await initPayment({
                amount: amount,
                email: email,
                callback_url,
                metadata: { recordID: newTransaction._id },
            });
            if (!success) throw new ForbiddenError('Could not initialize payment');

            const payload = await TransactionModel.findOneAndUpdate(
                { _id: newTransaction._id },
                {
                    reference: initInfo.data.reference,
                    accessCode: initInfo.data.access_code,
                },
                { new: true }
            );
            return payload;
        } catch (error) {
            throw new Error(error);

        }
    }



    @Mutation(() => Transaction)
    async verifyPayment(
        @Arg('input') { reference }: ConfirmInput,
        @Ctx('token') token: string
    ) {
        const { uid } = await firebase.admin.auth().verifyIdToken(token);

        const user = await userModelUidQuery(uid)

        const res = await verifyPayment(reference);
        // console.log(res)

        if (!res.success) {
            throw new UserInputError('Transaction Reference not found');
        }
        const {
            data: {
                data: {
                    metadata: { recordID },
                },
            },
        } = res;
        const record = await TransactionModel.findOne({
            userId: user._id,
            reference,
            _id: recordID,
        });
        if (!record) {
            throw new ForbiddenError('Could not find payment record');
        }
        const { status, vote } = record;

        // this payment might have been confirmed before
        if (status === paymentStatus.COMPELTE) {
            return record;
        }
        //updating wallet votes
        const wallet = await WalletModel.findOne({ userId: user._id });
        if (wallet) {
            const { balance } = wallet

            const newBal = balance! + vote
            await wallet.updateOne({ balance: newBal })

        }

        // update the record
        const newRecord = await TransactionModel.findOneAndUpdate(
            { _id: record._id },
            { status: paymentStatus.COMPELTE, isSuccess: true },
            { new: true }
        );
        return newRecord;
    }

    @Query(() => [Transaction])
    async getUserTransactions(@Ctx('token') token: string) {
        const { uid } = await firebase.admin.auth().verifyIdToken(token);
        const user = await userModelUidQuery(uid)

        const transactions = await TransactionModel.find({ userId: user._id });
        return transactions;
    }

    @Authorized('ADMIN')
    @Query(() => [Transaction])
    async getAllTransactions() {
        const transactions = await TransactionModel.find();
        return transactions;
    }
}
