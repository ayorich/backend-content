import axios from 'axios';
import { PaymentRequest } from './types';
const INIT_PAYMENT = 'https://api.paystack.co/transaction/initialize';
const VERIFY_PAYMENT = 'https://api.paystack.co/transaction/verify';

// const FETCH_TRANSACTION = 'https://api.paystack.co/transaction/<id>';
// const GET_TRANSACTIONS = 'https://api.paystack.co/transaction';

const PAYSTACK_KEY = process.env._PAYSTACK_API_KEY || '';

export const initPayment = async (requestPayload: PaymentRequest) => {
    try {
        const { data } = await axios.post(INIT_PAYMENT, requestPayload, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_KEY}`,
            },
        });
        return { success: true, data };
    } catch (error) {
        console.log(error);
        return { success: false, error };
    }
};

export const verifyPayment = async (paymentRefrence: string) => {
    try {
        const { data } = await axios.get(
            `${VERIFY_PAYMENT}/${paymentRefrence}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_KEY}`,
                },
            }
        );
        return { success: true, data };
    } catch (error) {
        console.log(error);
        return { success: false, error };
    }
};
