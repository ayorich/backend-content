import { Resolver, Arg, Query, Mutation, Authorized, Ctx } from 'type-graphql';
import { Vote, VoteModel } from '../../models/Vote';

import { VoteInput } from './input';
import utils from '../../utils';
import { WalletModel } from '../../models/Wallet';
const { firebase } = utils;

@Resolver()
export class VoteResolver {

    @Authorized('ADMIN')
    @Query(() => [Vote])
    async returnAllVote(): Promise<Vote[]> {
        return await VoteModel.find();
    }

    @Authorized()
    @Query(() => [Vote])
    async returnAllVoteByUser(@Ctx('token') token: string): Promise<Vote[]> {
        const { uid } = await firebase.admin.auth().verifyIdToken(token);

        return await VoteModel.find({ userId: uid });
    }


    @Query(() => [Vote])
    async returnVotesPerContestantForAnEventDeprecated(
        @Arg('contestantId') contestantId: string,
        @Arg('eventId') eventId: string,

    ): Promise<Vote[]> {

        return await VoteModel.find({ contestantId, eventId });
    }




    @Authorized()
    @Mutation(() => Vote)
    async createVote(@Arg('data') data: VoteInput, @Ctx('token') token: string): Promise<Vote> {
        const { uid } = await firebase.admin.auth().verifyIdToken(token);
        const { vote, contestantId, eventId } = data;

        try {
            const wallet = await WalletModel.findOne({ userId: uid });
            if (wallet) {
                const { balance } = wallet
                if (balance) {
                    if (vote <= balance) {

                        const newBal = balance - vote
                        await wallet.updateOne({ balance: newBal })
                        const voteCreated = await VoteModel.create({
                            contestantId, userId: uid, vote, eventId
                        });

                        return voteCreated;
                    }
                    throw new Error('Not enough credit avaliable');
                }

                throw new Error('no avaliable balance');

            }
            throw new Error('No wallet for this user');


        } catch (error) {
            throw new Error(error);
        }
    }
}
