import { Resolver, Arg, Query, Mutation, Authorized } from 'type-graphql';
import { VoteCost, VoteCostModel } from '../../models/VoteCost';
import { UpdateVoteCostInput, VoteCostInput } from './input';

@Resolver()
export class VoteCostResolver {

    @Authorized('ADMIN')
    @Query(() => [VoteCost])
    async returnAllVoteCost(): Promise<VoteCost[]> {
        return await VoteCostModel.find();
    }


    @Authorized('ADMIN')
    @Mutation(() => VoteCost)
    async createVoteCost(@Arg('data') { costPerVote }: VoteCostInput): Promise<VoteCost> {
        try {

            const VoteCostCreated = await VoteCostModel.create({
                costPerVote
            });

            return VoteCostCreated;

        } catch (error) {
            throw new Error(error);
        }
    }


    @Authorized('ADMIN')
    @Mutation(() => VoteCost)
    async updateVoteCost(
        @Arg('data') { costPerVote }: UpdateVoteCostInput
    ): Promise<VoteCost> {
        try {

            const voteCost = await VoteCostModel.findOne();

            if (voteCost) {

                await voteCost.updateOne({ costPerVote })

                return voteCost;
            }

            throw new Error(`No such document or not authorised`);

        } catch (error) {
            throw new Error(error);
        }
    }
}
