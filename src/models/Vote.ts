import { ObjectType, Field, ID, Int } from 'type-graphql';
import { prop as Property, plugin, getModelForClass, post } from '@typegoose/typegoose';
import softDelete from '../utils/softDelete';
import { User } from './User'
import { Contestant, ContestantModel } from './Contestant'
import { Event } from './Event'

import { Ref } from '../types';


@post<Vote>('save', async function (vote) {
    const stats = await VoteModel.aggregate([

        {
            $match: { contestantId: vote.contestantId },
        },
        {
            $match: { eventId: vote.eventId },
        },
        {
            $group: {
                _id: '$contestantId',
                nUser: { $sum: 1 },
                totalVote: { $sum: '$vote' }
            }
        }

    ]);
    console.log(stats)
    if (stats.length > 0) {
        await ContestantModel.findByIdAndUpdate(stats[0]._id, {
            nUserWhoVoted: stats[0].nUser,
            totalVote: stats[0].totalVote
        });



    } else {
        await ContestantModel.findByIdAndUpdate(stats[0]._id, {
            nUserWhoVoted: 0,
            totalVote: 0
        });
    }
})

@ObjectType({ description: 'The Vote model' })
@plugin(softDelete())
export class Vote {
    @Field(() => ID)
    id: string;

    @Field(() => Int)
    @Property({ required: true })
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

