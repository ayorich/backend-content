import { InputType, Field } from 'type-graphql';
import { Vote } from '../../models/Vote';
import { ObjectId } from 'mongodb';

@InputType()
export class VoteInput implements Partial<Vote> {

    @Field()
    vote: number;

    @Field(() => String)
    eventId: ObjectId;

    @Field(() => String)
    contestantId: ObjectId;

}
