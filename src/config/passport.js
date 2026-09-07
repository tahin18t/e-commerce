import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from 'dotenv';
import UserModel from '../models/UserModel.js';
import { EncodeToken } from '../utility/TokenHelper.js';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/v1/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error('Google account has no email')); 

      let user = await UserModel.findOne({ email });
      if (!user) {
        user = await UserModel.create({ email, otp: '' });
      }

      const token = EncodeToken(email, user._id.toString());
      return done(null, { token });
    } catch (error) {
      done(error);
    }
  }
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/api/v1/auth/facebook/callback',
  profileFields: ['id', 'emails', 'name', 'picture']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(new Error('Facebook account has no email'));

    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({
        email,
        provider: 'facebook',
        googleId: profile.id // or add facebookId field
      });
    }

    const token = EncodeToken(email, user._id.toString());
    return done(null, { token });
  } catch (error) {
    done(error);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
