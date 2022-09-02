import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { nextAuthOptions } from '../../pages/api/auth/[...nextauth]';
import { UserModel } from '../../types/myTypes';

export interface ExtendedNextApiRequest extends NextApiRequest {
	user: UserModel;
}

export const withAuth = async (
	req: ExtendedNextApiRequest,
	res: NextApiResponse,
	next: any
) => {
	const session = await unstable_getServerSession(req, res, nextAuthOptions);
	if (session && session.user) {
		req.user = session.user;
		return next();
	} else {
		return res.status(401).json('Unauthorized access');
	}
};
