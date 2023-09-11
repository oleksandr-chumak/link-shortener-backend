import { Controller, Get, Query, Res } from '@nestjs/common';
import { ConfirmationTokenService, Payload } from '../../token';
import { UserService } from '../../user';
import { UserNotFoundException } from '../../user/exceptions';
import { InvalidTokenException } from '../exceptions';

@Controller('auth/confirmation')
export class ConfirmationController {
  constructor(
    private readonly confirmationTokenService: ConfirmationTokenService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async confirm(@Query('token') token: string, @Res() res): Promise<void> {
    let payload: Payload;
    try {
      payload = await this.confirmationTokenService.verifyAccessToken(token);
    } catch (e) {
      throw new InvalidTokenException();
    }
    const user = await this.userService.findUserById(payload.id, {
      credentials: true,
    });
    if (!user) {
      throw new UserNotFoundException();
    }
    user.credentials.confirm = true;
    await this.userService.save(user);
    res.redirect('http://localhost:3000/login');
  }
}
``;
