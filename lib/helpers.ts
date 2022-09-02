import User from '../models/user';
import connectMongo from './mongoose';
import { MongoUserModel, SocialMediaData } from '../types/myTypes';

export const getUserKeyFromDB = async (
	userId: string,
	social: string
): Promise<SocialMediaData> => {
	if (!userId) {
		const error = new Error('User Id not provided');
		error.code = 401;
		throw error;
	}
	if (!social) {
		const error = new Error('Social media not provided');
		error.code = 401;
		throw error;
	}
	await connectMongo();
	const user: MongoUserModel = await User.findById(userId)
		.select('+socials')
		.exec();
	if (!user) {
		const error = new Error('User not found');
		error.code = 401;
		throw error;
	}
	const userAPIData = user.socials.find((s) => s.provider === social);
	if (!userAPIData) {
		const error = new Error('No social data found');
		error.code = 401;
		throw error;
	}
	return userAPIData;
};
