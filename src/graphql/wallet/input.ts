import { InputType, Field } from 'type-graphql';
import { Wallet } from '../../models/Wallet';
import { ObjectId } from 'mongodb';

@InputType()
export class WalletInput implements Partial<Wallet> {

    @Field()
    balance: number;

    @Field(() => String)
    userId: ObjectId;


}
