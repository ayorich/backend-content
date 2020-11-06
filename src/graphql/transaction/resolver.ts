import { Resolver, Mutation, Arg, Authorized, Ctx, Query } from 'type-graphql';
import { initPayment } from '../../config/paystack';
// import moment from 'moment';
// import { InvestmentModel } from '../../models/Investment';
import { UserInputError, ForbiddenError } from 'apollo-server-express';
import {
    Transaction,
    TransactionModel,
    PaymentDirection,
    // paymentStatus,
} from '../../models/Transaction';
import { VoteCostModel } from '../../models/VoteCost';
import { TransactionInput } from './input';
import utils from '../../utils';
const { firebase } = utils;

Authorized();
@Resolver(() => Transaction)
export class TransactionResolver {
    @Mutation(() => Transaction)
    async initializePayment(
        @Arg('input') { vote, voteCostId, callback_url }: TransactionInput,
        @Ctx('token') token: string
    ) {
        const { uid, email } = await firebase.admin.auth().verifyIdToken(token);
        if (!email) throw new Error('No email attached to this account');

        // get proper amount
        const voteCost = await VoteCostModel.findById(voteCostId);
        if (!voteCost) throw new UserInputError('No vote per cost with the given id');

        console.log(vote)
        console.log(voteCost)
        console.log(voteCost.costPerVote)
        const amount = vote * voteCost.costPerVote * 100;

        const newTransaction = await TransactionModel.create({
            email,
            userID: uid,
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
        if (!success) throw new ForbiddenError('Could not initialize pament');

        const payload = await TransactionModel.findOneAndUpdate(
            { _id: newTransaction._id },
            {
                reference: initInfo.data.reference,
                accessCode: initInfo.data.access_code,
            },
            { new: true }
        );
        return payload;
    }



    // @Mutation(() => Transaction)
    // async verifyPayment(
    //     @Arg('input') { reference }: ConfirmInput,
    //     @Ctx('token') token: string
    // ) {
    //     const { uid } = await firebase.admin.auth().verifyIdToken(token);
    //     const res = await verifyPayment(reference);
    //     if (!res.success) {
    //         throw new UserInputError('Transaction Reference not found');
    //     }
    //     const {
    //         data: {
    //             data: {
    //                 metadata: { recordID },
    //             },
    //         },
    //     } = res;
    //     const record = await TransactionModel.findOne({
    //         userID: uid,
    //         reference,
    //         _id: recordID,
    //     });
    //     if (!record) {
    //         throw new ForbiddenError('Could not find payment record');
    //     }
    //     const { status, units, amount } = record;

    //     // this payment might have been confirmed before
    //     if (status === paymentStatus.COMPELTE) {
    //         return record;
    //     }

    //     const investedProject = await ProjectModel.findById(record.projectID);
    //     if (!investedProject) {
    //         throw new Error('Could not find invested project');
    //     }
    //     // create an investment for this user
    //     const { id, roi, maturity } = investedProject;
    //     const dueDate = moment().add(maturity, 'months').format();
    //     const expectedIncome = (roi / 100) * amount + amount;

    //     const newInvestment = {
    //         currentIncome: 0,
    //         expectedIncome,
    //         projectId: id,
    //         units,
    //         userId: uid,
    //         dueDate,
    //     };

    //     await InvestmentModel.create(newInvestment);
    //     // reduce the projectAvialable unit
    //     await ProjectModel.findOneAndUpdate(
    //         { _id: record.projectID },
    //         { availableUnits: investedProject.availableUnits - record.units }
    //     );

    //     // update the record
    //     const newRecord = await TransactionModel.findOneAndUpdate(
    //         { _id: record._id },
    //         { status: paymentStatus.COMPELTE, isSuccess: true },
    //         { new: true }
    //     );
    //     return newRecord;
    // }

    @Query(() => [Transaction])
    async getUserTransactions(@Ctx('token') token: string) {
        const { uid } = await firebase.admin.auth().verifyIdToken(token);
        const transactions = await TransactionModel.find({ userID: uid });
        return transactions;
    }

    @Authorized('ADMIN')
    @Query(() => [Transaction])
    async getAllTransactions() {
        const transactions = await TransactionModel.find();
        return transactions;
    }
}
