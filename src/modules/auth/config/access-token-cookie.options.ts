import { authJwtConfig } from '../../token/config';
import { transformDateToMilliseconds } from '../helpers';

export const accessTokenCookieOptions = {
  httpOnly: true,
  maxAge: transformDateToMilliseconds(authJwtConfig.accessExpiredIn),
};
