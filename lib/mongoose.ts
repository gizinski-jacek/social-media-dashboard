import mongoose from 'mongoose';

const options = {};

if (!process.env.MONGODB_URI) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env.local'
	);
}

const connectMongo = async () =>
	mongoose.connect(process.env.MONGODB_URI as string, options);

export default connectMongo;
