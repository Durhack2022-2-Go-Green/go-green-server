import mongoose from 'mongoose';
import logger from './lib/logger.js';

import './config/env.config.js'; // workaround for ES imports being hoisted, to import the env file before other modules
import server from './app.js';

const port = process.env.PORT??8080;

mongoose.connect(
	process.env.MONGODB_URI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	(error) => {
		if (error) {
			logger.error(error.message);
			process.exit(1);
		}

		logger.info('Connected to MongoDB');
		server.listen(port, () => {
			logger.info(`Server listening on port ${port}`);
		});
	}
);

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => process.on(signal, handleExit));

function handleExit(signal) {
	logger.debug(`Received ${signal}, exiting...`);
	mongoose.disconnect();
	process.exit();
}
