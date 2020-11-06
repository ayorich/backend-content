import { Resolver, Arg, Query, Mutation, Authorized } from 'type-graphql';
import { Vote, VoteModel } from '../../models/Vote';

import { VoteInput } from './input';

@Resolver()
export class VoteResolver {

    @Authorized('ADMIN')
    @Query(() => [Vote])
    async returnAllVote(): Promise<Vote[]> {
        return await VoteModel.find();
    }

    @Authorized()
    @Query(() => [Vote])
    async returnAllVoteByUser(@Arg('userId') userId: string): Promise<Vote[]> {
        return await VoteModel.find({ userId });
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
    async createVote(@Arg('data') data: VoteInput): Promise<Vote> {
        const { vote, contestantId, userId, eventId } = data;
        try {

            const voteCreated = await VoteModel.create({
                contestantId, userId, vote, eventId
            });

            return voteCreated;

        } catch (error) {
            throw new Error(error);
        }
    }
}
