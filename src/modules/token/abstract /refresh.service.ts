import { Payload, Tokens } from '../interfaces';

export abstract class RefreshService {
  abstract generateRefreshToken(payload: Payload): Promise<string>;
  abstract verifyRefreshToken(refreshToken: string): Promise<Payload>;
  abstract generateAccessTokenByRefreshToken(
    refreshToken: string,
  ): Promise<string>;
  abstract generateTokens(payload: Payload): Promise<Tokens>;
}
