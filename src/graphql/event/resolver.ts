import { Resolver, Arg, Query, Mutation, Authorized } from 'type-graphql';
import { Event, EventModel } from '../../models/Event';

import { EventInput } from './input';

@Resolver()
export class EventResolver {
    @Authorized()
    @Query(() => Event, { nullable: false })
    async returnSingleEvent(@Arg('id') id: string) {
        return await EventModel.findById(id).populate('userId');
    }

    @Authorized()
    @Query(() => [Event])
    async returnAllEvent(): Promise<Event[]> {
        return await EventModel.find();
    }


    @Authorized('ADMIN')
    @Mutation(() => Event)
    async createEvent(@Arg('data') data: EventInput): Promise<Event> {
        const { eventTitle, description, startDate, closingDate, userId, imageUrl } = data;
        try {

            const eventCreated = await EventModel.create({
                eventTitle, description, startDate, closingDate, userId, imageUrl
            });

            return eventCreated;

        } catch (error) {
            throw new Error(error);
        }
    }
}
