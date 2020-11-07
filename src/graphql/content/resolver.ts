import { Resolver, Arg, Query, Mutation, Authorized } from 'type-graphql';
import { Content, ContentModel } from '../../models/Content';

import { ContentInput } from './input';



@Resolver()
export class ContentResolver {

    @Authorized()
    @Query(() => Content, { nullable: false })
    async returnSingleContent(@Arg('id') id: string) {
        return await ContentModel.findById(id);
    }

    @Authorized()
    @Query(() => [Content])
    async returnContentsPerContestantForAnEvent(
        @Arg('contestantId') contestantId: string,
        @Arg('eventId') eventId: string,

    ): Promise<Content[]> {

        return await ContentModel.find({ contestantId, eventId });
    }



    @Authorized('ADMIN')
    @Mutation(() => Content)
    async createContent(@Arg('data') data: ContentInput): Promise<Content> {
        const { url, mediaType, contestantId, eventId, title } = data;
        try {

            const contentCreated = await ContentModel.create({
                url, mediaType, contestantId, eventId, title
            });

            return contentCreated;

        } catch (error) {
            throw new Error(error);
        }
    }
}
