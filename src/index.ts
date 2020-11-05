// import express, { Server, Request, Response } from 'express';
import express, { Server, Request, Response } from 'express';
import graphQlServer from './server';

const PORT = process.env.PORT || 8360;

// Add your subscriptions

const app: Server = express();
app.get('/test', (_: Request, res: Response) => {
	res.redirect('https://contentplatform-9ae85.web.app/');

});
// const router = express.Router();
graphQlServer(app).catch(err => console.log(err));

app.listen(PORT, () => {
	console.log(`🚀 Server ready and listening at port  ${PORT} `);
});
export default app;
