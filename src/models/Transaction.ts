import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from './User';

export enum PaymentDirection {
    INCOMING_PAYMENT = 'INCOMING_PAYMENT',
    OUTGOINGPAYMENT = 'OUTGOING_PAYMENT',
}

export enum paymentStatus {
    PROCESSING = 'PROCESSING',
    COMPELTE = 'COMPLETE',
}

@ObjectType({ description: 'The Transaction model' })
export class Transaction {
    @Field(() => ID)
    id: string;

    @Field()
    @Property({ required: false, default: 'null' })
    reference?: string;

    @Field()
    @Property({ required: false, default: 'null' })
    accessCode?: string;

    @Field()
    @Property({ required: true, trim: true })
    email: string;

    @Field(() => User)
    @Property({ ref: User })
    userId: Ref<User>;

    @Field()
    @Property({ required: true })
    voteCostId: string;

    @Field()
    @Property({ required: true })
    amount: number;

    @Field()
    @Property({ required: true })
    vote: number;

    @Field()
    @Property({ required: true })
    direction: PaymentDirection;

    @Field()
    @Property({ required: false, default: false })
    isSuccess?: boolean;

    @Field()
    @Property({ default: Date.now() })
    date?: Date;

    @Field()
    @Property({ required: false, default: paymentStatus.PROCESSING })
    status?: paymentStatus;
}

export const TransactionModel = getModelForClass(Transaction, {
    schemaOptions: { timestamps: true },
});
