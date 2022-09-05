// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import connectMongo from '../../../lib/mongoose';
import { MongoUserModel } from '../../../types/myTypes';
import User from '../../../models/user';
import nc from 'next-connect';
import {
	ExtendedNextApiRequest,
	withAuth,
} from '../../../lib/middleware/withAuth';
import axios, { AxiosError } from 'axios';

const handler = nc<ExtendedNextApiRequest, NextApiResponse>({
	onError: (err, req, res, next) => {
		console.error(err.stack);
		return res.status(500).end('Something broke!');
	},
	onNoMatch: (req, res) => {
		return res.status(404).end('Page not found');
	},
})
	.use(withAuth)
	.delete(async (req, res, next) => {
		try {
			const { social } = req.query as { social: string };
			await connectMongo();
			const user: MongoUserModel = await User.findById(req.user._id)
				.select('+socials')
				.exec();
			if (!user) {
				return res.status(404).json('User not found');
			}
			const userSocial = user.socials.find((s) => s.provider === social);
			if (!userSocial) {
				return res.status(404).json('No data to delete found');
			}
			if (social === 'facebook') {
				await axios.delete(
					`https://graph.facebook.com/${userSocial.id}/permissions?access_token=${userSocial.access_token}`
				);
			}
			const updatedUser = await User.findByIdAndUpdate(
				req.user._id,
				{ $pull: { socials: { provider: social } } },
				{ timestamps: true, new: true }
			)
				.select('+socials')
				.exec();
			if (!updatedUser) {
				return res.status(404).json('Error updating user');
			}
			return res.status(200).json({ success: true });
		} catch (error) {
			console.log(error.response.data);
			if (error instanceof AxiosError) {
				return res
					.status(error?.response?.status || 404)
					.json(error?.response?.data || 'Unknown error');
			} else {
				return res.status(404).json('Unknown error');
			}
		}
	});

export default handler;
