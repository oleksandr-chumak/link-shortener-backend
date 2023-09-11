import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthTokenService, ConfirmationTokenService } from '../../token';
import { CheckEmailDto, LoginUserDto, RegisterUserDto } from '../dto';
import { AuthService } from '../services';
import {
  AccountNotConfirmException,
  InvalidCredentialsException,
  InvalidTokenException,
  TokenNotFoundException,
} from '../exceptions';
import { MailAuthService } from '../../mail/services';
import { getServerUrl } from '@common/helpers/get-server-url.helper';
import { Message } from '../interfaces';
import { refreshTokenCookieOptions } from '../config';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthLocalController {
  constructor(
    private authService: AuthService,
    private authTokenService: AuthTokenService,
    private confirmationTokenService: ConfirmationTokenService,
    private mailService: MailAuthService,
  ) {}

  @Post('/login')
  async login(
    @Res() res: Response,
    @Body() loginData: LoginUserDto,
  ): Promise<void> {
    const user = await this.authService.validateUser(
      loginData.email,
      loginData.password,
    );
    if (!user) {
      throw new InvalidCredentialsException();
    }
    if (!user.credentials.confirm) {
      throw new AccountNotConfirmException();
    }
    const refreshToken = await this.authTokenService.generateRefreshToken({
      id: user.id,
    });
    res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions);
    res.json({ message: 'Account was successfully login in' });
  }

  @Post('/register')
  async register(@Body() registerData: RegisterUserDto): Promise<Message> {
    const newUser = await this.authService.registerUser(registerData);
    const accessToken = await this.confirmationTokenService.generateAccessToken(
      {
        id: newUser.id,
      },
    );
    const confirmUrl =
      getServerUrl() + '/auth/' + 'confirmation' + '?token=' + accessToken;
    this.mailService.confirmAccount(
      newUser.email,
      confirmUrl,
      newUser.username,
    );

    return { message: 'Account was successfully registered' };
  }

  @Get('/refresh')
  async refresh(@Req() req: Request): Promise<string> {
    const refreshToken: string | undefined = req.cookies.refresh_token;
    if (!refreshToken) {
      throw new TokenNotFoundException();
    }
    try {
      return await this.authTokenService.generateAccessTokenByRefreshToken(
        refreshToken,
      );
    } catch (err) {
      throw new InvalidTokenException();
    }
  }

  @Get('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie('refresh_token');
    res.json({ message: 'Account was successfully logged out' });
  }

  @Post('/check-email')
  async checkEmail(@Body() { email }: CheckEmailDto): Promise<Message> {
    await this.authService.checkIsUserExist(email);
    return {
      message: "User doesn't exist",
    };
  }
}
