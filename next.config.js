/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ['scontent-waw1-1.xx.fbcdn.net', 'static.xx.fbcdn.net'],
	},
};

module.exports = nextConfig;
