import { Module } from '@nestjs/common';
import { UserModule } from '../user';
import { AuthService, CryptService } from './services';
import {
  AuthLocalController,
  ConfirmationController,
  AuthGoogleController,
  PasswordResetController,
} from './controllers';
import { TokenModule } from '../token';
import { MailModule } from '../mail';
@Module({
  imports: [UserModule, TokenModule, MailModule],
  controllers: [
    AuthLocalController,
    AuthGoogleController,
    ConfirmationController,
    PasswordResetController,
  ],
  providers: [AuthService, CryptService],
})
export class AuthModule {}
