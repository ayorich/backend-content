import { ObjectType, Field, ID, Int } from 'type-graphql';
import { prop as Property, plugin, getModelForClass } from '@typegoose/typegoose';
import softDelete from '../utils/softDelete';


@ObjectType({ description: 'The Wallet model' })
@plugin(softDelete())
export class Wallet {
    @Field(() => ID)
    id: string;

    @Field(() => Int)
    @Property({ default: 0 })
    balance?: number;

    @Field()
    @Property({ required: false, trim: true })
    userId: string;
}
export const WalletModel = getModelForClass(Wallet, {
    schemaOptions: { timestamps: true },
});


