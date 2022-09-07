import type { GetServerSidePropsContext } from 'next';
import Facebook from '../../components/socials/Facebook';
import Twitter from '../../components/socials/Twitter';
import Instagram from '../../components/socials/Instagram';
import { SocialContext } from '../../hooks/SocialProvider';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { supportedSocialList } from '../../lib/defaults';
import { getSession } from 'next-auth/react';
import { MongoUserModel, SocialHasAccess } from '../../types/myTypes';
import { useRouter } from 'next/router';
import connectMongo from '../../lib/mongoose';
import User from '../../models/user';

const socialComponents = {
	facebook: Facebook,
	twitter: Twitter,
	instagram: Instagram,
};

interface Props {
	data: SocialHasAccess[];
}

const Dashboard = ({ data }: Props) => {
	const { social, updateSocial } = useContext(SocialContext);
	const [socialsAccess, setSocialsAccess] = useState(data);
	const router = useRouter();
	const SocialComponent = social ? socialComponents[social] : null;

	const handleSocialChange = (value: string | null) => {
		updateSocial(value);
	};

	useEffect(() => {}, [router.query, updateSocial]);

	return (
		<Box>
			{social ? (
				socialsAccess.find((s) => s.provider === social) ? (
					<Box
						sx={{
							width: '100%',
							height: '100%',
							display: 'flex',
							flexDirection: 'row',
							overflow: 'auto',
							flexWrap: 'wrap',
						}}
					>
						<SocialComponent />
					</Box>
				) : (
					<Button
						component='a'
						href={`/api/social-oauth/${social}`}
						type='button'
						variant='contained'
					>
						Sign in with {social}
					</Button>
				)
			) : (
				<Box sx={{ mx: 'auto', maxWidth: '75%' }}>
					<Grid container p={2}>
						{supportedSocialList.map((social, index) => (
							<Grid key={index} item xs={3} sx={{ textAlign: 'center' }}>
								<Button
									type='button'
									variant='contained'
									color={
										socialsAccess.find((s) => s.provider === social)
											? 'success'
											: 'warning'
									}
									onClick={() => handleSocialChange(social)}
								>
									{social}
								</Button>
							</Grid>
						))}
					</Grid>
				</Box>
			)}
		</Box>
	);
};

export const getServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	let socialsAccessList: SocialHasAccess[] = [];
	try {
		const session = await getSession(context);
		if (!session) {
			return {
				redirect: {
					permanent: false,
					destination: '/',
				},
				props: {},
			};
		}
		if (session && session.user) {
			await connectMongo();
			const user: MongoUserModel = await User.findById(session.user._id)
				.lean()
				.select('+socials')
				.exec();
			if (!user || !user.socials) {
				return;
			}
			socialsAccessList = user.socials.map((s) => ({
				provider: s.provider,
				has_access: s.access_token ? true : false,
			}));
		}
		// else if (context.req.cookies.tempUserToken) {
		// 	if (!process.env.JWT_STRATEGY_SECRET) {
		// 		return;
		// 	}
		// 	const decodedToken = jwt.verify(
		// 		context.req.cookies.tempUserToken,
		// 		process.env.JWT_STRATEGY_SECRET
		// 	) as TempUserToken;
		// 	accessTokenList = decodedToken.api_data.map((item) => {
		// 		const keyStatus = { social: item.social, has_key: true };
		// 		for (const [key, value] of Object.entries(item)) {
		// 			if (!value) {
		// 				keyStatus.has_key = false;
		// 				break;
		// 			}
		// 		}
		// 		return keyStatus;
		// 	});
		// }
		return {
			props: { data: socialsAccessList },
		};
	} catch (error) {
		console.log(error);
		return {
			props: { data: [] },
		};
	}
};

export default Dashboard;
