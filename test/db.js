import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;

export async function connect() {
	mongod = await MongoMemoryServer.create();

	const uri = mongod.getUri();

	const mongooseOpts = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};

	mongoose.connect(uri, mongooseOpts);
}

export async function closeDatabase() {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	await mongod.stop();
}

export async function clearDatabase() {
	const collections = mongoose.connection.collections;

	for (const key in collections) {
		const collection = collections[key];
		await collection.deleteMany();
	}
}
