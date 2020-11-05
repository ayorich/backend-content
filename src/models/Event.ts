import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, plugin, getModelForClass } from '@typegoose/typegoose';
import softDelete from '../utils/softDelete';
import { User } from './User'
import { Ref } from '../types';


@ObjectType({ description: 'The Event model' })
@plugin(softDelete())
export class Event {
    @Field(() => ID)
    id: string;

    @Field()
    @Property()
    eventTitle: string;

    @Field()
    @Property()
    imageUrl: string;

    @Field()
    @Property()
    description: string;

    @Field(() => Date)
    @Property()
    startDate: Date;

    @Field(() => Date)
    @Property()
    closingDate: Date;

    @Field(() => User)
    @Property({ ref: User })
    userId: Ref<User>;
}
export const EventModel = getModelForClass(Event, {
    schemaOptions: { timestamps: true },
});
