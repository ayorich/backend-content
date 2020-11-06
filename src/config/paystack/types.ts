export type PaymentRequest = {
    email: string;
    amount: number;
    callback_url: string;
    metadata: {
        recordID: string;
    };
};
