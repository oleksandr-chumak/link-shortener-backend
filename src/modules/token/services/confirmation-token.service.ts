import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../interfaces';
import { confirmationJwtConfig } from '../config';
import { AccessService } from '../abstract ';

@Injectable()
export class ConfirmationTokenService implements AccessService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: Payload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: confirmationJwtConfig.accessSecret,
      expiresIn: confirmationJwtConfig.accessExpiredIn,
    });
  }

  async verifyAccessToken(accessToken: string): Promise<Payload> {
    return await this.jwtService.verifyAsync(accessToken, {
      secret: confirmationJwtConfig.accessSecret,
    });
  }
}
