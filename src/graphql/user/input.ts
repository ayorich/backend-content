import { InputType, Field } from 'type-graphql';
import { Length, IsEmail } from 'class-validator';
import { User } from '../../models/User';

@InputType()
export class UserProfileInput implements Partial<User> {
	@Field()
	uid: string;

	@Field()
	@Length(3, 25)
	firstName: string;

	@Field()
	@Length(3, 25)
	lastName: string;

	@Field()
	@IsEmail()
	email: string;

	@Field()
	phoneNumber: string;

	@Field({ nullable: true })
	role?: string;


}



@InputType()
export class RoleInput implements Partial<User> {
	@Field()
	uid: string;

	@Field()
	role: string;
}



// registerEnumType(InvesteeActionType, {name: 'InvesteeActionType'});

// @ArgsType()
// export class MetaArgs {
// 	@Field((_type) => String, { nullable: true, description: undefined })
// 	info?: string | undefined;

// 	@Field((_type) => InvesteeActionType, { nullable: true, description: undefined })
// 	action?: InvesteeActionType;
// }

