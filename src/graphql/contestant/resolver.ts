import { Resolver, Arg, Query, Mutation } from 'type-graphql';
import { Contestant, ContestantModel } from '../../models/Contestant';

import { ContestantInput } from './input';

@Resolver()
export class ContestantResolver {
    @Query(() => Contestant, { nullable: false })
    async returnSingleContestant(@Arg('id') id: string) {
        return await ContestantModel.findById(id);
    }

    @Query(() => [Contestant])
    async returnAllContestant(): Promise<Contestant[]> {
        return await ContestantModel.find();
    }

    @Query(() => [Contestant])
    async returnContestantForAnEvent(@Arg('eventId') eventId: string): Promise<Contestant[]> {
        return await ContestantModel.find({ eventId });
    }


    @Mutation(() => Contestant)
    async createContestant(@Arg('data') data: ContestantInput): Promise<Contestant> {
        const { firstName, lastName, age, bio, eventId, imageUrl } = data;
        try {

            const contestantCreated = await ContestantModel.create({
                firstName, lastName, age, bio, eventId, imageUrl
            });

            if (contestantCreated) {
                return contestantCreated;
            }

            throw new Error('Contestant not created');
        } catch (error) {
            throw new Error(error);
        }
    }
}
