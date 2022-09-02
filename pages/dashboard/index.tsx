import type { GetServerSidePropsContext } from 'next';
import Facebook from '../../components/socials/Facebook';
import Twitter from '../../components/socials/Twitter';
import Instagram from '../../components/socials/Instagram';
import { SocialContext } from '../../hooks/SocialProvider';
import { useCallback, useContext, useState } from 'react';
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

	const handleSocialChange = useCallback(
		(value: string | null) => {
			updateSocial(value);
		},
		[updateSocial]
	);

	// useEffect(() => {
	// 	const { social } = router.query as { social: string };
	// 	console.log(social);
	// 	if (social) {
	// 		handleSocialChange(social);
	// 	}
	// }, [router.query, handleSocialChange]);

	return (
		<Box
			sx={{
				flex: 1,
				mt: '64px',
				ml: '64px',
				height: 'calc(100vh - 64px)',
				maxHeight: 'calc(100vh - 64px)',
				width: 'calc(100vw - 64px)',
				maxWidth: 'calc(100vw - 64px)',
				overflow: 'hidden',
			}}
		>
			{social ? (
				socialsAccess.find((s) => s.provider === social) ? (
					<Box
						sx={{
							width: '100%',
							height: '100%',
							overflow: 'auto',
							display: 'flex',
						}}
					>
						<SocialComponent />
					</Box>
				) : (
					<Button
						component='a'
						type='button'
						variant='contained'
						href={`/api/social-oauth/${social}`}
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
			props: { data: socialsAccessList },
		};
	}
};

export default Dashboard;
