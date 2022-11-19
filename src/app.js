import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';

import ApiRouter from './routes/api.route.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());

app.use('/api/', ApiRouter);

app.use((req, res, next) => {
	console.log(`Request received: ${req.method} ${req.url}`);
	res.setHeader('X-Powered-By', 'Hopefully Renewable Energy');
	res.setHeader('X-Author', 'Go Green');
	next();
});

export default app;
