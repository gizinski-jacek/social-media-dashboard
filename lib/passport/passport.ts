//@ts-nocheck

import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter-oauth2';
import { Strategy as InstagramStrategy } from 'passport-instagram-basic-api';
import { Strategy as SnapchatStrategy } from 'passport-snapchat';
import OAuth2Strategy from 'passport-oauth2';
import passport from 'passport';
export { default as passport } from 'passport';

passport.use(
	'facebook',
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
			callbackURL:
				process.env.MY_APP_URI + 'api/social-oauth/callback/facebook',
			profileFields: ['id', 'displayName', 'posts', 'photos'],
		},
		(accessToken, refreshToken, profile, done) => {
			const payload = {
				provider: profile.provider,
				id: profile.id,
				username: profile.displayName,
				picture: profile.photos[0].value,
				access_token: accessToken,
			};
			return done(null, payload);
		}
	)
);

// passport.use(
// 	'twitter',
// 	new OAuth2Strategy(
// 		{
// 			authorizationURL: 'https://twitter.com/i/oauth2/authorize',
// 			tokenURL: 'https://api.twitter.com/2/oauth2/token',
// 			clientID: process.env.TWITTER_APP_ID,
// 			clientSecret: process.env.TWITTER_APP_SECRET,
// 			callbackURL: process.env.MY_APP_URI + 'api/social-oauth/callback/twitter',
// 			// state: false,
// 		},
// 		(token, tokenSecret, profile, done) => {
// 			// Doesn't work atm, token issue even with correct one
// 			// Might be related to state/session config
// 			console.log(token);
// 			console.log(tokenSecret);
// 			console.log(profile);
// 			const payload = {
// 				accessToken,
// 				profile,
// 			};
// 			return done(null, {});
// 		}
// 	)
// );

// passport.use(
// 	'twitter',
// 	new TwitterStrategy(
// 		{
// 			clientID: process.env.TWITTER_APP_ID,
// 			clientSecret: process.env.TWITTER_APP_SECRET,
// 			callbackURL: process.env.MY_APP_URI + 'api/social-oauth/callback/twitter',
// 		},
// 		(token, tokenSecret, profile, done) => {
// 			// Doesn't work atm, token issue even with correct one
// 			console.log(token);
// 			console.log(tokenSecret);
// 			console.log(profile);
// 			const payload = {
// 				accessToken,
// 				profile,
// 			};
// 			return done(null, {});
// 		}
// 	)
// );

passport.use(
	'instagram',
	new InstagramStrategy(
		{
			clientID: process.env.INSTAGRAM_APP_ID,
			clientSecret: process.env.INSTAGRAM_APP_SECRET,
			callbackURL:
				process.env.MY_APP_URI + 'api/social-oauth/callback/instagram',
		},
		(accessToken, refreshToken, profile, done) => {
			const payload = {
				provider: profile.provider,
				id: profile.id,
				username: profile.displayName,
				access_token: accessToken,
			};
			return done(null, payload);
		}
	)
);

// passport.use(
// 	'snapchat',
// 	new SnapchatStrategy(
// 		{
// 			clientID: process.env.SNAPCHAT_APP_ID,
// 			clientSecret: process.env.SNAPCHAT_APP_SECRET,
// 			callbackURL: '/api/social-oauth/callback/snapchat',
// 		},
// 		async (token, tokenSecret, profile, done) => {
// 			console.log(44);
// 			console.log(profile);
// 			try {
// 				return done(null, profile);
// 			} catch (error) {
// 				done(error);
// 			}
// 		}
// 	)
// );
