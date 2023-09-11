import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OnlyAuthorizedGuard } from '../../auth/guards';
import { UserService } from '../services';
import { UserNotFoundException } from '../exceptions';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(OnlyAuthorizedGuard)
  @Get('me')
  async getMe(@Req() req) {
    const id = req.user;
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }
}
