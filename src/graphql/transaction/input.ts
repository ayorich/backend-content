import { InputType, Field } from 'type-graphql';
import { Transaction } from '../../models/Transaction';

@InputType()
export class TransactionInput implements Partial<Transaction> {
    @Field()
    vote: number;

    @Field()
    voteCostId: string;

    @Field()
    callback_url: string;
}

@InputType()
export class ConfirmInput {
    @Field()
    reference: string;
}
