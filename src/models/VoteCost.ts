import { ObjectType, Field, ID, Int } from 'type-graphql';
import { prop as Property, plugin, getModelForClass, pre } from '@typegoose/typegoose';
import softDelete from '../utils/softDelete';

@pre<VoteCost>('save', async function (next: any) {
    const docNum = await VoteCostModel.countDocuments()
    if (docNum >= 1) {
        throw new Error('Only one Document is allowed in this collection');
    }

    next();
})


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
