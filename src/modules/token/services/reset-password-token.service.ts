import { Injectable } from '@nestjs/common';
import { AccessService } from '../abstract ';
import { Payload } from '../interfaces';
import { JwtService } from '@nestjs/jwt';
import { resetPasswordConfig } from '../config/reset-password.config';

@Injectable()
export class ResetPasswordTokenService implements AccessService {
  constructor(private readonly jwtService: JwtService) {}
  generateAccessToken(payload: Payload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: resetPasswordConfig.accessSecret,
      expiresIn: resetPasswordConfig.accessExpiredIn,
    });
  }

  verifyAccessToken(accessToken: string): Promise<Payload> {
    return this.jwtService.verifyAsync(accessToken, {
      secret: resetPasswordConfig.accessSecret,
    });
  }
}
