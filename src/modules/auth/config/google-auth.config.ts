import { OAuth2ClientOptions } from 'google-auth-library';
import * as process from 'process';
export const GoogleAuthConfig: OAuth2ClientOptions = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'http://localhost:8000/auth/google/login/callback',
};
