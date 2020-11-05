import { InputType, Field } from 'type-graphql';
import { Length } from 'class-validator';
import { Contestant } from '../../models/Contestant';
import { ObjectId } from 'mongodb';

@InputType()
export class ContestantInput implements Partial<Contestant> {

    @Field()
    @Length(3, 25)
    firstName: string;

    @Field()
    @Length(3, 25)
    lastName: string;

    @Field()
    email: string;

    @Field()
    age: string;

    @Field()
    imageUrl: string;

    @Field()
    bio: string;

    @Field(() => String)
    eventId: ObjectId;


}
