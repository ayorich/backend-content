import { Resolver, Arg, Query, Mutation } from 'type-graphql';
import { Content, ContentModel } from '../../models/Content';

import { ContentInput } from './input';

@Resolver()
export class ContentResolver {
    @Query(() => Content, { nullable: false })
    async returnSingleContent(@Arg('id') id: string) {
        return await ContentModel.findById(id);
    }

    @Query(() => [Content])
    async returnContentsPerContestantForAnEvent(
        @Arg('contestantId') contestantId: string,
        @Arg('eventId') eventId: string,

    ): Promise<Content[]> {

        return await ContentModel.find({ contestantId, eventId });
    }




    @Mutation(() => Content)
    async createContent(@Arg('data') data: ContentInput): Promise<Content> {
        const { url, mediaType, contestantId, eventId, title } = data;
        try {

            const contentCreated = await ContentModel.create({
                url, mediaType, contestantId, eventId, title
            });

            if (contentCreated) {
                return contentCreated;
            }

            throw new Error('Content not created');
        } catch (error) {
            throw new Error(error);
        }
    }
}
