import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, plugin, getModelForClass } from '@typegoose/typegoose';
import softDelete from '../utils/softDelete';
import { Event } from './Event'
import { Contestant } from './Contestant'
import { Ref } from '../types';


@ObjectType({ description: 'The Content model' })
@plugin(softDelete())
export class Content {
    @Field(() => ID)
    id: string;

    @Field()
    @Property({ required: true, trim: true })
    title: string;

    @Field()
    @Property({ required: true, trim: true })
    mediaType: string;

    @Field()
    @Property({ required: true, trim: true })
    url: string;

    @Field(() => Event)
    @Property({ ref: Event })
    eventId: Ref<Event>;

    @Field(() => Contestant)
    @Property({ ref: Contestant })
    contestantId: Ref<Contestant>;
}
export const ContentModel = getModelForClass(Content, {
    schemaOptions: { timestamps: true },
});
