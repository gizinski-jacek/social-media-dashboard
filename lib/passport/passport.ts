//@ts-nocheck

import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter-oauth2';
import { Strategy as InstagramStrategy } from 'passport-instagram-basic-api';
import { Strategy as SnapchatStrategy } from 'passport-snapchat';
import OAuth2Strategy from 'passport-oauth2';
import passport from 'passport';
import axios from 'axios';
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
		async (accessToken, refreshToken, profile, done) => {
			try {
				const longLivedToken = await axios.get(
					`https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${accessToken}`
				);
				const payload = {
					provider: profile.provider,
					id: profile.id,
					username: profile.displayName,
					picture: profile.photos[0].value,
					access_token: longLivedToken.data.access_token,
					expires_in: longLivedToken.data.expires_in,
				};
				return done(null, payload);
			} catch (error) {
				return done(error);
			}
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
		async (accessToken, refreshToken, profile, done) => {
			try {
				const longLivedToken = await axios.get(
					`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_APP_SECRET}&access_token=${accessToken}`
				);
				console.log(longLivedToken.data.access_token);
				const payload = {
					provider: profile.provider,
					id: profile.id,
					username: profile.username,
					access_token: longLivedToken.data.access_token,
				};
				return done(null, payload);
			} catch (error) {
				return done(error);
			}
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
