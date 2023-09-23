import { Module } from '@nestjs/common';
import { LinkController, LinkFilterController } from './controllers';
import {
  CodeService,
  DateService,
  LinkFilterService,
  LinkService,
} from './services';
import {
  LinkStatusRepository,
  OriginalLinkRepository,
  ShortLinkRepository,
} from './repositories';

@Module({
  controllers: [LinkController, LinkFilterController],
  providers: [
    LinkService,
    LinkFilterService,
    DateService,
    ShortLinkRepository,
    LinkStatusRepository,
    OriginalLinkRepository,
    CodeService,
  ],
})
export class LinkModule {}
