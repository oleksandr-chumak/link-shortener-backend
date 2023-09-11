import * as process from 'process';

export const authJwtConfig = {
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshSecret: process.env.REFRESH_TOKEN_SECRET,
  accessExpiredIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
  refreshExpiredIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
};
