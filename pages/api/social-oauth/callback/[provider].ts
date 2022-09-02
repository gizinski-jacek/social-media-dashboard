// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import nc from 'next-connect';
import { passport } from '../../../../lib/passport/passport';
import connectMongo from '../../../../lib/mongoose';
import { MongoUserModel, SocialMediaData } from '../../../../types/myTypes';
import User from '../../../../models/user';

const handler = nc<NextApiRequest, NextApiResponse>({
	onError: (err, req, res, next) => {
		console.error(err.stack);
		res.status(500).end('Something broke!');
	},
	onNoMatch: (req, res) => {
		res.status(404).end('Page not found');
	},
}).get(async (req, res, next) => {
	const { provider } = req.query as { provider: string };
	if (!provider) {
		return res.status(404).end('Provider not supported');
	}
	passport.authenticate(
		provider,
		{ session: false },
		async (error, payload, msg) => {
			if (error) {
				return next(error);
			}
			try {
				const token = await getToken({ req });
				if (!token || !payload) {
					return res.status(404).end('Error authenticating');
				}
				await connectMongo();
				const dbUser: MongoUserModel = await User.findById(token.user._id)
					.select('+socials')
					.exec();
				if (!dbUser) {
					return res.status(404).end('User not found');
				}
				const socialExists = (dbUser.socials as SocialMediaData[]).find(
					(s) => s.provider === provider
				);
				if (socialExists) {
					const updatedUser = await User.findByIdAndUpdate(
						dbUser._id,
						{ $set: { 'socials.$[el]': payload } },
						{
							arrayFilters: [{ 'el.provider': provider }],
							timestamps: true,
							new: true,
						}
					).exec();
					if (!updatedUser) {
						return res.status(404).json('Error updating user data');
					}
					return res.redirect(`/dashboard?social=${provider}`);
				} else {
					const updatedUser = await User.findByIdAndUpdate(
						dbUser._id,
						{ $addToSet: { socials: payload } },
						{ upsert: true, timestamps: true, new: true }
					).exec();
					if (!updatedUser) {
						return res.status(404).json('Error updating user data');
					}
					return res.redirect(`/dashboard?social=${provider}`);
				}
			} catch (error) {
				console.log(error);
				return res.status(404).end('Error authenticating');
			}
		}
	)(req, res, next);
});

export default handler;
