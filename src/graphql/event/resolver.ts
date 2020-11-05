import { Resolver, Arg, Query, Mutation } from 'type-graphql';
import { Event, EventModel } from '../../models/Event';

import { EventInput } from './input';

@Resolver()
export class EventResolver {
    @Query(() => Event, { nullable: false })
    async returnSingleEvent(@Arg('id') id: string) {
        return await EventModel.findById(id).populate('userId');
    }

    @Query(() => [Event])
    async returnAllEvent(): Promise<Event[]> {
        return await EventModel.find();
    }


    @Mutation(() => Event)
    async createEvent(@Arg('data') data: EventInput): Promise<Event> {
        const { name, description, duration, userId, imageUrl } = data;
        try {

            const eventCreated = await EventModel.create({
                name, description, duration, userId, imageUrl
            });

            if (eventCreated) {
                return eventCreated;
            }

            throw new Error('Event not created');
        } catch (error) {
            throw new Error(error);
        }
    }
}
