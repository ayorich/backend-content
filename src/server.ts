import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { connect } from 'mongoose';
import config from './config';
import http from 'http';
import 'reflect-metadata';

// resolvers
import resolvers from './graphql';
import utils from './utils';
import { join } from 'path';
const { firebase } = utils;

const graphQlServer = async (app: any) => {
	// console.log(await process.cwd())
	const schema = await buildSchema({
		resolvers,
		validate: false,
		// emitSchemaFile: true,
		emitSchemaFile: {
			path: join(process.cwd(), 'src/schema.gql'),
			commentDescriptions: true,
		},
		authChecker: async ({ context: { token } }, role) => {
			const verify = await firebase.admin.auth().verifyIdToken(token);
			if (verify) {
				if (role.length > 0) {
					if (verify.role == role[0]) {
						return true;
					}
					return false;
				}
				return true;
			}
			// user is not verified
			return false;
		},
	});

	// create mongoose connection
	const mongoose = await connect(config.getDbUrl(), {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	});
	await mongoose.connection;

	const server = new ApolloServer({
		context: async ({ req, res, connection }) => {
			if (connection) {
				const token = connection.context['authorization'];
				return { req, res, token };
			} else {
				const token = req.headers.authorization || null;
				return { req, res, token };
			}
		},

		subscriptions: {
			onConnect: async (connectionParams, _webSocket, _context: any) => {
				// const { authorization: token } = connectionParams;
				console.log(
					`Subscription client connected using Apollo server's built-in SubscriptionServer.`
				);
				return connectionParams;
			},
			onDisconnect: async (_webSocket, _context) => {
				console.log(`Subscription client disconnected.`);
			},
		},
		schema,
		introspection: true,
		playground: true,
	});
	server.applyMiddleware({ app, cors: true, path: '/' });
	const httpServer = http.createServer(app);
	server.installSubscriptionHandlers(httpServer);

	return { httpServer, server };
};
export default graphQlServer;
