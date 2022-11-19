import express from 'express';
import cors from 'cors';

import ApiRouter from './routes/api.route.js';

const app = express();

app.use(cors());

app.use('/api/', ApiRouter);

app.use((req, res, next) => {
	console.log(`Request received: ${req.method} ${req.url}`);
	res.setHeader('X-Powered-By', 'Hopefully Renewable Energy');
	res.setHeader('X-Author', 'Go Green');
	next();
});

export default app;
