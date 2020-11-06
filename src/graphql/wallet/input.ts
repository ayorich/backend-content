import { InputType, Field } from 'type-graphql';
import { Wallet } from '../../models/Wallet';

@InputType()
export class WalletInput implements Partial<Wallet> {
    @Field()
    userId: string;


}
