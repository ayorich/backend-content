import { Resolver, Arg, Query, Mutation } from 'type-graphql';
import { Wallet, WalletModel } from '../../models/Wallet';

import { WalletInput } from './input';

@Resolver()
export class WalletResolver {

    @Query(() => Wallet, { nullable: false })
    async returnUserWallet(@Arg('userId') userId: string) {
        return await WalletModel.findOne({ userId });
    }


    @Mutation(() => Wallet)
    async createWallet(@Arg('data') data: WalletInput): Promise<Wallet> {
        const { userId, balance } = data;
        try {

            const walletCreated = await WalletModel.create({
                userId, balance
            });

            if (walletCreated) {
                return walletCreated;
            }

            throw new Error('Wallet not created');
        } catch (error) {
            throw new Error(error);
        }
    }
}
