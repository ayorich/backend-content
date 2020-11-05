import { InputType, Field } from 'type-graphql';
import { Content } from '../../models/Content';
import { ObjectId } from 'mongodb';

@InputType()
export class ContentInput implements Partial<Content> {

    @Field()
    title: string;

    @Field()
    mediaType: string;

    @Field()
    url: string;

    @Field(() => String)
    eventId: ObjectId;

    @Field(() => String)
    contestantId: ObjectId;

}
