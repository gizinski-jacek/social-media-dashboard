// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { withAuth } from '../../../lib/middleware/withAuth';
import { passport } from '../../../lib/passport/passport';

const scopes = {
	facebook: [], // Leave empty, use profileFields in strategy instead
	twitter: ['users.read ', 'tweet.read ', 'offline.access'],
	instagram: ['user_profile', 'user_media', 'user_posts', 'instagram_basic'],
};

const handler = nc<NextApiRequest, NextApiResponse>({
	onError: (err, req, res, next) => {
		console.error(err.stack);
		return res.status(500).end('Something broke!');
	},
	onNoMatch: (req, res) => {
		return res.status(404).end('Page not found');
	},
})
	.use(withAuth)
	.get(async (req, res, next) => {
		const { provider } = req.query as { provider: string };
		if (!provider) {
			return res.status(404).end('Provider not supported');
		}
		passport.authenticate(provider, {
			session: false,
			scope: scopes[provider],
		})(req, res, next);
	});

export default handler;
