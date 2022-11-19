import './config/env.config.js'; // workaround for ES imports being hoisted, to import the env file before other modules
import server from './app.js';

server.listen(process.env.PORT??8080, () => {
	console.log(`Listening on port ${process.env.PORT??8080}`);
});
