import {
  Controller,
  Get,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { GoogleAuthConfig, refreshTokenCookieOptions } from '../config';
import { ExternalUser } from '../interfaces';
import { AuthService } from '../services';
import { ProviderName, UserService } from '../../user';
import { AuthTokenService } from '../../token';

@Controller('auth/google')
export class AuthGoogleController {
  private _googleClient: OAuth2Client;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: AuthTokenService,
  ) {
    this._googleClient = new OAuth2Client(GoogleAuthConfig);
  }

  @Get('/login')
  login(@Res() res): void {
    const authUrl = this._googleClient.generateAuthUrl({
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    });
    res.redirect(authUrl);
  }

  @Get('/login/callback')
  async loginCallback(@Res() res, @Query('code') code: string) {
    try {
      const tokenResponse = await this._googleClient.getToken(code);
      const idToken = tokenResponse.tokens.id_token;
      const ticket = await this._googleClient.verifyIdToken({
        idToken,
        audience: GoogleAuthConfig.clientId,
      });
      const payload = ticket.getPayload();
      const user: ExternalUser = {
        id: payload.sub,
        email: payload.email,
        username: payload.name,
        photo: payload.picture,
      };
      const newUserId = await this.authService.externalUser(
        user,
        ProviderName.GOOGLE,
      );
      const foundUser = await this.userService.findUserById(newUserId, {
        credentials: true,
      });
      if (!foundUser.credentials.confirm) {
        foundUser.credentials.confirm = true;
        await this.userService.save(foundUser);
      }
      const refreshToken = await this.jwtService.generateRefreshToken({
        id: newUserId,
      });
      res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions);
      res.redirect('http://localhost:3000');
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }
}
