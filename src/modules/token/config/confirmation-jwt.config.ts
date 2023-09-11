import * as process from 'process';

export const confirmationJwtConfig = {
  accessSecret: process.env.ACCESS_CONFIRM_SECRET,
  accessExpiredIn: process.env.ACCESS_CONFIRM_TOKEN_EXPIRE_IN,
};
