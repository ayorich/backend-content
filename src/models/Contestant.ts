import { ObjectType, Field, ID, Int } from 'type-graphql';
import {
	prop as Property,
	plugin,
	getModelForClass,
} from '@typegoose/typegoose';
import softDelete from '../utils/softDelete';
import onSaveExtraFields from '../utils/contestantPlugin';
import { Event } from './Event';
import { Ref } from '../types';

@ObjectType({ description: 'The Contestant model' })
@plugin(softDelete())
@plugin(onSaveExtraFields())
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
	@Property({ required: true, trim: true, unique: true })
	email: string;

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

	@Field(() => Int)
	@Property({ required: false })
	totalVote?: number;

	@Field(() => Int)
	@Property({ required: false })
	nUserWhoVoted?: number;
}
export const ContestantModel = getModelForClass(Contestant, {
	schemaOptions: { timestamps: true },
});
