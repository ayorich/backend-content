import { Resolver, Arg, Query, Mutation, Authorized } from 'type-graphql';
import { Contestant, ContestantModel } from '../../models/Contestant';

import { ContestantInput } from './input';
@Resolver()
export class ContestantResolver {

    @Authorized()
    @Query(() => Contestant, { nullable: false })
    async returnSingleContestant(@Arg('id') id: string) {
        return await ContestantModel.findById(id);
    }

    @Authorized('ADMIN')
    @Query(() => [Contestant])
    async returnAllContestant(): Promise<Contestant[]> {
        return await ContestantModel.find();
    }

    @Authorized()
    @Query(() => [Contestant])
    async returnContestantForAnEvent(@Arg('eventId') eventId: string): Promise<Contestant[]> {
        return await ContestantModel.find({ eventId });
    }


    @Authorized('ADMIN')
    @Mutation(() => Contestant)
    async createContestant(@Arg('data') data: ContestantInput): Promise<Contestant> {
        const { firstName, lastName, age, bio, eventId, imageUrl, email } = data;
        try {

            const contestantCreated = await ContestantModel.create({
                firstName, lastName, age, bio, eventId, imageUrl, email
            });

            return contestantCreated;

        } catch (error) {
            throw new Error(error);
        }
    }
}
