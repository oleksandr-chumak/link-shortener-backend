import * as process from 'process';

export const resetPasswordConfig = {
  accessSecret: process.env.ACCESS_RESET_SECRET,
  accessExpiredIn: process.env.ACCESS_RESET_TOKEN_EXPIRE_IN,
};
