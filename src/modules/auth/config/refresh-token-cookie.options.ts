import { authJwtConfig } from '../../token/config';
import { transformDateToMilliseconds } from '../helpers';

export const refreshTokenCookieOptions = {
  httpOnly: true,
  maxAge: transformDateToMilliseconds(authJwtConfig.refreshExpiredIn),
};
