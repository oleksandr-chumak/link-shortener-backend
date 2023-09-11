import { Injectable } from '@nestjs/common';
import { Tokens, Payload } from '../interfaces';
import { JwtService } from '@nestjs/jwt';
import { authJwtConfig } from '../config';
import { AccessService, RefreshService } from '../abstract ';

@Injectable()
export class AuthTokenService implements AccessService, RefreshService {
  constructor(private readonly jwtService: JwtService) {}

  public generateAccessToken(payload: Payload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: authJwtConfig.accessSecret,
      expiresIn: authJwtConfig.accessExpiredIn,
    });
  }
  public generateRefreshToken(payload: Payload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: authJwtConfig.refreshSecret,
      expiresIn: authJwtConfig.refreshExpiredIn,
    });
  }
  public verifyAccessToken(accessToken: string): Promise<Payload> {
    return this.jwtService.verifyAsync(accessToken, {
      secret: authJwtConfig.accessSecret,
    });
  }
  public verifyRefreshToken(refreshToken: string): Promise<Payload> {
    return this.jwtService.verifyAsync(refreshToken, {
      secret: authJwtConfig.refreshSecret,
    });
  }
  public async generateTokens(payload: Payload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
  public async generateAccessTokenByRefreshToken(
    refreshToken: string,
  ): Promise<string> {
    const payload = await this.verifyRefreshToken(refreshToken);
    return this.generateAccessToken({ id: payload.id });
  }
}
