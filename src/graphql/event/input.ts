import { InputType, Field } from 'type-graphql';
import { Length } from 'class-validator';
import { Event } from '../../models/Event';
import { ObjectId } from 'mongodb';

@InputType()
export class EventInput implements Partial<Event> {

    @Field()
    @Length(3, 45)
    eventTitle: string;

    @Field()
    description: string;

    @Field()
    imageUrl: string;

    @Field(() => Date)
    startDate: Date;

    @Field(() => Date)
    closingDate: Date;

    @Field(() => String)
    userId: ObjectId;


}
