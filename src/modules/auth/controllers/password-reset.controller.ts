import { Body, Controller, Post } from '@nestjs/common';
import { MailAuthService } from '../../mail/services';
import { UserService } from '../../user';
import { UserNotFoundException } from '../../user/exceptions';
import { Message } from '../interfaces';
import { Payload, ResetPasswordTokenService } from '../../token';
import {
  CheckResetTokenDto,
  ResetPasswordDto,
  ResetPasswordRequestDto,
} from '../dto';
import {
  InvalidTokenException,
  PasswordNotMatchException,
  SamePasswordException,
} from '../exceptions';
import { CryptService } from '../services';

@Controller('auth/reset')
export class PasswordResetController {
  constructor(
    private readonly mailService: MailAuthService,
    private readonly userService: UserService,
    private readonly resetPasswordTokenService: ResetPasswordTokenService,
    private readonly cryptService: CryptService,
  ) {}

  @Post('/request-password-reset')
  async resetRequest(
    @Body() resetRequestData: ResetPasswordRequestDto,
  ): Promise<Message> {
    console.log('here');
    const user = await this.userService.findUserByEmail(resetRequestData.email);
    if (!user) {
      throw new UserNotFoundException();
    }
    const accessToken =
      await this.resetPasswordTokenService.generateAccessToken({
        id: user.id,
      });
    const resetPasswordUrl =
      'http://localhost:3000' + '/reset' + '?token=' + accessToken;
    this.mailService.resetPassword(user.email, resetPasswordUrl, user.username);
    return { message: 'Password reset link has been sent' };
  }

  @Post('/reset-password')
  async resetPassword(@Body() resetData: ResetPasswordDto): Promise<Message> {
    console.log('here');
    if (resetData.newPassword !== resetData.newConfirmPassword) {
      throw new PasswordNotMatchException();
    }
    let payload: Payload;
    try {
      payload = await this.resetPasswordTokenService.verifyAccessToken(
        resetData.token,
      );
    } catch (e) {
      throw new InvalidTokenException();
    }
    const foundUser = await this.userService.findUserById(payload.id, {
      credentials: true,
    });
    if (!foundUser) {
      throw new UserNotFoundException();
    }
    let isPasswordMatch = false;
    if (foundUser.credentials.password) {
      isPasswordMatch = await this.cryptService.compare(
        resetData.newPassword,
        foundUser.credentials.password,
      );
    }

    if (isPasswordMatch) {
      throw new SamePasswordException();
    }
    const newHashedPassword = await this.cryptService.hash(
      resetData.newPassword,
    );
    foundUser.credentials.password = newHashedPassword;
    foundUser.credentials.updatedAt = new Date();
    await this.userService.save(foundUser);
    return { message: 'Password was reset' };
  }

  @Post('check-token')
  async checkToken(@Body() data: CheckResetTokenDto): Promise<Message> {
    try {
      await this.resetPasswordTokenService.verifyAccessToken(data.token);
    } catch (e) {
      throw new InvalidTokenException();
    }
    return { message: 'Token is valid' };
  }
}
