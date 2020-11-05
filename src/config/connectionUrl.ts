import { config } from 'dotenv';
config();

let dbUrl: string;

const getDbUrl = (): string => {
    if (process.env.NODE_ENV === 'test') {
        dbUrl = process.env._MONGO_URI_LOCAL || '';
    } else {
        dbUrl = process.env._MONGO_DB_CONNECTION_STRING_LIVE || '';
    }
    return dbUrl;
};

export default getDbUrl;
