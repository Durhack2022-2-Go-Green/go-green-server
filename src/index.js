import logger from './log.js';

import './config/env.config.js'; // workaround for ES imports being hoisted, to import the env file before other modules
import server from './app.js';

logger.info('Server starting');

server.listen(process.env.PORT??8080, () => {
	logger.info(`Listening on port ${process.env.PORT??8080}`);
});
