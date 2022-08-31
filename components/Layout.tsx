import { getSession, GetSessionParams, SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import Head from 'next/head';
import Nav from './Nav';
import styles from '../styles/Layout.module.scss';
import { SocialContextProvider } from '../hooks/SocialProvider';
import { ThemeContextProvider } from '../hooks/ThemeProvider';

interface Props {
	children: React.ReactNode;
	session: Session;
}

const Layout = ({ children, session }: Props) => {
	return (
		<SessionProvider session={session}>
			<SocialContextProvider>
				<ThemeContextProvider>
					<Head>
						<title>Social Media Dashboard</title>
						<meta name='description' content='Social Media Dashboard' />
						<link rel='icon' href='/favicon.ico' />
					</Head>
					<Nav />
					<main className={styles.main}>{children}</main>
				</ThemeContextProvider>
			</SocialContextProvider>
		</SessionProvider>
	);
};

export const getServerSideProps = async (context: GetSessionParams) => {
	return {
		props: {
			session: await getSession(context),
		},
	};
};

export default Layout;
