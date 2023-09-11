import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ShortLinkDto } from './link.dto';
import { LinkService } from './link.service';
import { OnlyAuthorizedGuard } from '../auth/guards';
import { ICurrentUser } from '../user';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { Response } from 'express';
import { ShortLinkEntity } from './short-link.entity';

@Controller('')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post('link/shorten')
  shortenLink(@Body() body: ShortLinkDto): Promise<string> {
    const { link } = body;
    return this.linkService.shortenLink(link);
  }

  @UseGuards(OnlyAuthorizedGuard)
  @Post('link/auth/shorten')
  shortenLinkAuthenticated(
    @Body() body: ShortLinkDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<string> {
    const { id } = user;
    const { link } = body;
    return this.linkService.shortenLink(link, id);
  }

  @UseGuards(OnlyAuthorizedGuard)
  @Get('links')
  getUserShortenLinks(
    @CurrentUser() user: ICurrentUser,
  ): Promise<ShortLinkEntity[]> {
    const { id } = user;
    return this.linkService.getUserShortenLinks(id);
  }

  @Get(':code')
  async getOriginalLink(
    @Param('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    const shortenLink = await this.linkService.findShortenLinkByCode(code);
    if (!shortenLink) {
      throw new NotFoundException('link not found');
    }
    await this.linkService.increaseClickNumber(shortenLink);
    res.redirect(shortenLink.original_link);
  }
}
