import { ObjectType, Field, ID, Int } from 'type-graphql';
import { prop as Property, plugin, getModelForClass } from '@typegoose/typegoose';
import softDelete from '../utils/softDelete';


@ObjectType({ description: 'The Cost per Vote model' })
@plugin(softDelete())
export class VoteCost {
    @Field(() => ID)
    id: string;

    @Field(() => Int)
    @Property({ required: true })
    costPerVote: number;


}
export const VoteCostModel = getModelForClass(VoteCost, {
    schemaOptions: { timestamps: true },
});
