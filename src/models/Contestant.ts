import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, plugin, getModelForClass } from '@typegoose/typegoose';
import softDelete from '../utils/softDelete';
import { Event } from './Event'
import { Ref } from '../types';


@ObjectType({ description: 'The Contestant model' })
@plugin(softDelete())
export class Contestant {
    @Field(() => ID)
    id: string;

    @Field()
    @Property({ required: true, trim: true })
    firstName: string;

    @Field()
    @Property({ required: true, trim: true })
    lastName: string;

    @Field()
    @Property({ required: true, trim: true })
    age: string;

    @Field()
    @Property()
    imageUrl: string;

    @Field()
    @Property()
    bio: string;

    @Field(() => Event)
    @Property({ ref: Event })
    eventId: Ref<Event>;
}
export const ContestantModel = getModelForClass(Contestant, {
    schemaOptions: { timestamps: true },
});
