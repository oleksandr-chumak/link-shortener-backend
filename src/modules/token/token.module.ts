import { Global, Module } from '@nestjs/common';
import {
  AuthTokenService,
  ConfirmationTokenService,
  ResetPasswordTokenService,
} from './services';
import { JwtModule } from '@nestjs/jwt';
@Global()
@Module({
  imports: [JwtModule],
  providers: [
    AuthTokenService,
    ConfirmationTokenService,
    ResetPasswordTokenService,
  ],
  exports: [
    AuthTokenService,
    ConfirmationTokenService,
    ResetPasswordTokenService,
  ],
})
export class TokenModule {}
