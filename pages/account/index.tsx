import { useCallback, useEffect, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import axios from 'axios';
import { Button, FormControl, Grid, Input, InputLabel } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { MongoUserModel, SocialHasAccess } from '../../types/myTypes';
import User from '../../models/user';
import connectMongo from '../../lib/mongoose';
import { supportedSocialList } from '../../lib/defaults';

interface Props {
	data: SocialHasAccess[];
}

const Account = ({ data }: Props) => {
	const [socialsAccess, setSocialsAccess] = useState(data);

	const handleUnlinkSocialMedia = async (social: string) => {
		try {
			const res = await axios.delete(
				`/api/account/account-data?social=${social}`
			);
			if (res.status === 200) {
				const newState = socialsAccess.filter((s) => s.provider !== social);
				setSocialsAccess(newState);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Box>
			<Grid container p={2}>
				{supportedSocialList.map((socialName, index) => {
					const social = socialsAccess.find((s) => s.provider === socialName);
					return social ? (
						<Grid key={index} item xs={3} sx={{ textAlign: 'center' }}>
							<Button
								key={index}
								type='button'
								variant='contained'
								color='success'
								onClick={() => handleUnlinkSocialMedia(socialName)}
							>
								{`Unlink ${socialName}`}
							</Button>
						</Grid>
					) : (
						<Grid key={index} item xs={3} sx={{ textAlign: 'center' }}>
							<Button
								key={index}
								component='a'
								href={`/api/social-oauth/${socialName}`}
								type='button'
								variant='contained'
								color='warning'
							>
								{`Link ${socialName}`}
							</Button>
						</Grid>
					);
				})}
			</Grid>
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

export default Account;
