import { beforeAll, afterEach, afterAll, describe, it } from '@jest/globals';

import * as database from './db.js';

beforeAll(async () => await database.connect());
afterEach(async () => await database.clearDatabase());
afterAll(async () => await database.closeDatabase());

describe('Database', () => {

	it('Adds a user', (done) => {
		// TODO
		done();
	});

});
