import { ObjectType, Field, ID, Int } from 'type-graphql';
import { prop as Property, plugin, getModelForClass } from '@typegoose/typegoose';
import softDelete from '../utils/softDelete';
import { User } from './User'
import { Contestant } from './Contestant'
import { Event } from './Event'

import { Ref } from '../types';


@ObjectType({ description: 'The Vote model' })
@plugin(softDelete())
export class Vote {
    @Field(() => ID)
    id: string;

    @Field()
    @Property(() => Int)
    vote: number;

    @Field(() => Contestant)
    @Property({ ref: Contestant })
    contestantId: Ref<Contestant>;

    @Field(() => Event)
    @Property({ ref: Event })
    eventId: Ref<Event>;

    @Field(() => User)
    @Property({ ref: User })
    userId: Ref<User>;
}
export const VoteModel = getModelForClass(Vote, {
    schemaOptions: { timestamps: true },
});
