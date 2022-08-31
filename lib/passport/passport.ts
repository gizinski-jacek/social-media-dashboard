//@ts-nocheck

import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as InstagramStrategy } from 'passport-instagram';
import { Strategy as SnapchatStrategy } from 'passport-snapchat';
import passport from 'passport';
export { default as passport } from 'passport';

passport.use(
	'facebook',
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
			callbackURL: process.env.MY_APP_URI + 'api/social/callback/facebook',
			profileFields: ['id', 'email', 'displayName', 'picture.type(large)'],
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const payload = {
					profile,
					accessToken,
				};
				return done(null, payload);
			} catch (error) {
				done(error);
			}
		}
	)
);
