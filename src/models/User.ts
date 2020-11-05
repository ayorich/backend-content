import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import { prop as Property, plugin, getModelForClass } from '@typegoose/typegoose';
import softDelete from '../utils/softDelete';
import { userRole } from './types';


registerEnumType(userRole, { name: 'userRole' });
@ObjectType({ description: 'The User Profile model' })
@plugin(softDelete())
export class User {
	@Field(() => ID)
	id: string;

	@Field()
	@Property({ required: true })
	uid: string;

	@Field()
	@Property({ required: true, trim: true })
	email: string;

	@Field()
	@Property({ required: true, trim: true })
	firstName: string;

	@Field()
	@Property({ required: false, trim: true })
	lastName: string;

	@Field()
	@Property({ required: true, trim: true })
	phoneNumber: string;

	@Field()
	@Property({ required: false, default: userRole.USER })
	role?: string;

}
export const UserModel = getModelForClass(User, {
	schemaOptions: { timestamps: true },
});
