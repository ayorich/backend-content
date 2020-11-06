import { InputType, Field } from 'type-graphql';
import { VoteCost } from '../../models/VoteCost';

@InputType()
export class VoteCostInput implements Partial<VoteCost> {

    @Field()
    costPerVote: number;

}


@InputType()
export class UpdateVoteCostInput implements Partial<VoteCost> {

    @Field()
    costPerVote: number;

}
