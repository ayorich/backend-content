import { Resolver, Arg, Query, Mutation } from 'type-graphql';
import { User, UserModel } from '../../models/User';
import { WalletModel } from '../../models/Wallet';
import { RoleInput, UserProfileInput } from './input';
import { userRole } from '../../models/types';
import utils from '../../utils';
// import { mongoose } from '@typegoose/typegoose';

const { firebase } = utils;

@Resolver()
export class UserResolver {
	@Query(() => User, { nullable: false })
	async returnSingleUser(@Arg('uid') uid: string) {
		return await UserModel.findOne({ uid });
	}

	@Query(() => [User])
	async returnAllUser(): Promise<User[]> {
		return await UserModel.find();
	}


	@Mutation(() => User)
	async registerUser(@Arg('input') input: UserProfileInput): Promise<User> {
		const { email, phoneNumber, lastName, firstName, uid } = input;
		try {

			const userCreated = await UserModel.create({
				email,
				firstName,
				lastName,
				phoneNumber,
				uid
			});

			await firebase.admin
				.auth()
				.setCustomUserClaims(uid, { role: userRole.USER });

			await WalletModel.create({
				userId: userCreated.id
			});


			return userCreated;

		} catch (error) {
			throw new Error(error);
		}
	}



	@Mutation(() => User)
	async assignRole(@Arg('data') { uid, role }: RoleInput): Promise<User> {
		try {
			const user = await UserModel.findOne({ uid: uid.trim() });

			if (user) {
				await firebase.admin
					.auth()
					.setCustomUserClaims(uid, { role: role });
				await user.updateOne({ role });
				/**@todo to fix bug on not returning current user updated role */
				return user;
			}
			throw new Error('User does not exist');
		} catch (error) {
			throw new Error(error);
		}
	}
}
