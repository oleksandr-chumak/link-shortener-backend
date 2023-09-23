import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GetLinksDto, ShortLinkDto } from '../dto';
import { LinkService } from '../services';
import { OnlyAuthorizedGuard } from '../../auth/guards';
import { ICurrentUser } from '../../user';
import { CurrentUser } from '../../user/decorators/current-user.decorator';
import { Response } from 'express';
import { ShortLinkEntity } from '../entities/short-link.entity';

@Controller('')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post('link/shorten')
  async shortenLink(@Body() body: ShortLinkDto): Promise<ShortLinkEntity> {
    const { link } = body;
    return this.linkService.shortenLink(link);
  }

  @UseGuards(OnlyAuthorizedGuard)
  @Post('link/auth/shorten')
  shortenLinkAuthenticated(
    @Body() body: ShortLinkDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<ShortLinkEntity> {
    const { id } = user;
    const { link } = body;
    return this.linkService.shortenLink(link, id);
  }

  @UseGuards(OnlyAuthorizedGuard)
  @Get('links')
  getUserShortenLinks(
    @CurrentUser() user: ICurrentUser,
    @Query() query: GetLinksDto,
  ) {
    const { id } = user;
    return this.linkService.getUserShortenLinks(id, query);
  }

  @Get(':code')
  async getOriginalLink(
    @Param('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    const shortenLink = await this.linkService.findShortenLinkByCode(code, {
      originalLink: true,
    });
    if (!shortenLink) {
      throw new NotFoundException('link not found');
    }
    const { protocol, host, pathname, search } = shortenLink.originalLink;
    const originalLink = protocol + '//' + host + pathname + search;

    await this.linkService.increaseClickNumber(shortenLink);

    res.redirect(originalLink);
  }
}
