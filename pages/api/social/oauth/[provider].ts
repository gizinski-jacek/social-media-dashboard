// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { passport } from '../../../../lib/passport/passport';

const handler = nc<NextApiRequest, NextApiResponse>({
	onError: (err, req, res, next) => {
		console.error(err.stack);
		return res.status(500).end('Something broke!');
	},
	onNoMatch: (req, res) => {
		return res.status(404).end('Page not found');
	},
}).get(async (req, res, next) => {
	const { provider } = req.query as { provider: string };
	if (!provider) {
		return res.status(404).end('Provider not supported');
	}
	passport.authenticate(provider, { session: false })(req, res, next);
});

export default handler;
