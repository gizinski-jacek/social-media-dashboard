import { Link } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Social Media Dashboard</title>
				<meta name='description' content='Social Media Dashboard' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div>
				<Link href='/dashboard'>Go to the Dashboard</Link>
			</div>
		</>
	);
};

export default Home;
