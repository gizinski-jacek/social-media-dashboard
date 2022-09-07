/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ['scontent.fpoz4-1.fna.fbcdn.net', 'scontent.cdninstagram.com'],
	},
};

module.exports = nextConfig;
