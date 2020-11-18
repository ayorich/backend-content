import {
	Resolver,
	Arg,
	Query,
	Mutation,
	Authorized,
	Ctx,
	PubSub,
	PubSubEngine,
} from 'type-graphql';
import { Vote, VoteModel } from '../../models/Vote';

import { VoteInput } from './input';
import utils from '../../utils';
import { WalletModel } from '../../models/Wallet';
import { userModelUidQuery } from '../../utils/userModelUidQuery';
const { firebase } = utils;

@Resolver()
export class VoteResolver {
	@Authorized('ADMIN')
	@Query(() => [Vote])
	async returnAllVote(): Promise<Vote[]> {
		return await VoteModel.find();
	}

	@Authorized()
	@Query(() => [Vote])
	async returnAllVoteByUser(@Ctx('token') token: string): Promise<Vote[]> {
		const { uid } = await firebase.admin.auth().verifyIdToken(token);
		const user = await userModelUidQuery(uid);

		return await VoteModel.find({ userId: user._id });
	}

	@Query(() => [Vote])
	async returnVotesPerContestantForAnEventDeprecated(
		@Arg('contestantId') contestantId: string,
		@Arg('eventId') eventId: string
	): Promise<Vote[]> {
		return await VoteModel.find({ contestantId, eventId });
	}

	@Authorized()
	@Mutation(() => Vote)
	async createVote(
		@Arg('data') data: VoteInput,
		@Ctx('token') token: string,
		@PubSub() pubSub: PubSubEngine
	): Promise<Vote> {
		const { uid } = await firebase.admin.auth().verifyIdToken(token);
		const user = await userModelUidQuery(uid);

		const { vote, contestantId, eventId } = data;

		try {
			const wallet = await WalletModel.findOne({ userId: user._id });
			if (wallet) {
				const { balance } = wallet;
				if (balance) {
					if (vote <= balance) {
						const newBal = balance - vote;
						await wallet.updateOne({ balance: newBal });
						const voteCreated = await VoteModel.create({
							contestantId,
							userId: user._id,
							vote,
							eventId,
						});
						await pubSub.publish('PUBLISH_CONTESTANT_VOTES', data);

						return voteCreated;
					}
					throw new Error('Not enough credit avaliable');
				}

				throw new Error('no avaliable balance');
			}
			throw new Error('No wallet for this user');
		} catch (error) {
			throw new Error(error);
		}
	}
}
