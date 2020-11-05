import * as mongoose from 'mongoose';


export default () => (schema: mongoose.Schema): void => {

    schema.add({
        nUserWhoVoted: { type: Number, default: 0 },
        totalVote: { type: Number, default: 0 }

    });

};
