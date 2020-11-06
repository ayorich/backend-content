import { InputType, Field, registerEnumType } from 'type-graphql';
import { Length, IsEmail } from 'class-validator';
import { User } from '../../models/User';
import { userRole } from '../../models/types';


registerEnumType(userRole, { name: 'userRole' });

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


}

@InputType()
export class RoleInput implements Partial<User> {
	@Field()
	uid: string;

	@Field((_type) => userRole,)
	role: userRole;
}




