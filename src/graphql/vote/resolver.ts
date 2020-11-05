import { Resolver, Arg, Query, Mutation } from 'type-graphql';
import { Vote, VoteModel } from '../../models/Vote';

import { VoteInput } from './input';

@Resolver()
export class VoteResolver {

    @Query(() => [Vote])
    async returnAllVote(): Promise<Vote[]> {
        return await VoteModel.find();
    }

    @Query(() => [Vote])
    async returnAllVoteByUser(@Arg('userId') userId: string): Promise<Vote[]> {
        return await VoteModel.find({ userId });
    }

    @Query(() => [Vote])
    async returnVotesPerContestantForAnEvent(
        @Arg('contestantId') contestantId: string,
        @Arg('eventId') eventId: string,

    ): Promise<Vote[]> {

        return await VoteModel.find({ contestantId, eventId });
    }




    @Mutation(() => Vote)
    async createVote(@Arg('data') data: VoteInput): Promise<Vote> {
        const { vote, contestantId, userId, eventId } = data;
        try {

            const voteCreated = await VoteModel.create({
                contestantId, userId, vote, eventId
            });

            if (voteCreated) {
                return voteCreated;
            }

            throw new Error('Vote not created');
        } catch (error) {
            throw new Error(error);
        }
    }
}
