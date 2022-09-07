// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios, { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { getUserKeyFromDB } from '../../../../lib/helpers';
import {
	ExtendedNextApiRequest,
	withAuth,
} from '../../../../lib/middleware/withAuth';

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
	.get(async (req, res) => {
		if (req.query.instagram === 'get-user-feed') {
			try {
				const userKey = await getUserKeyFromDB(req.user._id, 'instagram');
				const response = await axios.get(
					`https://graph.instagram.com/${userKey.id}/media?fields=id,username,media,caption,timestamp,media_type,media_url,thumbnail_url,permalink&access_token=${userKey.access_token}`
				);
				// response.data.paging contains paging links for posts, deconstruct them later
				// to remove user's access token and return paging token and other parameters with
				// posts data to render previous/next posts buttons on client
				return res.status(200).json(response.data.data);
			} catch (error) {
				if (error instanceof AxiosError) {
					return res
						.status(error?.response?.status || 404)
						.json(error?.response?.data || 'Unknown error');
				} else {
					return res.status(404).json('Unknown error');
				}
			}
		}
	});

export default handler;
