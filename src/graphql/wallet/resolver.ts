import { Resolver, Arg, Query, Mutation, Authorized, Ctx } from 'type-graphql';
import { Wallet, WalletModel } from '../../models/Wallet';

import { WalletInput } from './input';
import utils from '../../utils';
const { firebase } = utils;

@Resolver()
export class WalletResolver {

    @Authorized()
    @Query(() => Wallet, { nullable: false })
    async returnUserWallet(@Ctx('token') token: string) {
        const { uid } = await firebase.admin.auth().verifyIdToken(token);
        return await WalletModel.findOne({ userId: uid.trim() });
    }


    @Authorized()
    @Mutation(() => Wallet)
    async createWallet(@Arg('data') data: WalletInput): Promise<Wallet> {
        const { userId } = data;
        try {

            const walletCreated = await WalletModel.create({
                userId
            });

            return walletCreated;

        } catch (error) {
            throw new Error(error);
        }
    }
}
