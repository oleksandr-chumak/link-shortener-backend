import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { OnlyAuthorizedGuard } from '../../auth/guards';
import { CurrentUser } from '../../user/decorators/current-user.decorator';
import { ICurrentUser } from '../../user';
import { GetFilterDto } from '../dto';
import { LinkFilterService } from '../services';

@Controller('link/filter')
export class LinkFilterController {
  constructor(private readonly linkFilterService: LinkFilterService) {}

  @UseGuards(OnlyAuthorizedGuard)
  @Get('')
  getFilters(@CurrentUser() user: ICurrentUser, @Query() query: GetFilterDto) {
    console.log('query');
    console.log(query);
    return this.linkFilterService.getFilters(user.id, query);
  }
}
