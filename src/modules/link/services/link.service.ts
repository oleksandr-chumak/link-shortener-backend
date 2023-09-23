import { Injectable } from '@nestjs/common';

import { ShortLinkEntity } from '../entities/short-link.entity';
import { OriginalLinkEntity } from '../entities/original-link.entity';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { CodeService } from './code.service';
import { GetLinksDto } from '../dto';
import { LinkStatusRepository, ShortLinkRepository } from '../repositories';
import { API_CONFIG } from '@common/config/api.config';

@Injectable()
export class LinkService {
  constructor(
    private readonly shortLinkRepository: ShortLinkRepository,
    private readonly linkStatusRepository: LinkStatusRepository,
    private readonly codeService: CodeService,
  ) {}

  async shortenLink(link: string, userId?: string): Promise<ShortLinkEntity> {
    const code = await this.codeService.ensureUniqueShortLinkCode();

    const originalLink = this.parseOriginalLink(link);

    const status = await this.linkStatusRepository.findOneBy({
      type: 'active',
    });

    const shortenLink = await this.shortLinkRepository.save({
      code: code,
      user: userId ? { id: userId } : null,
      originalLink: originalLink,
      status: status,
    });

    return shortenLink;
  }

  async getUserShortenLinks(userId: string, query: GetLinksDto) {
    const [links, count] = await this.shortLinkRepository.getLinksAndCount(
      userId,
      query,
    );

    const transformedLinks = this.transformLinks(links);

    return {
      links: transformedLinks,
      linksCount: count,
    };
  }

  async findShortenLinkByCode(
    code: string,
    relations?: FindOptionsRelations<ShortLinkEntity>,
  ) {
    return this.shortLinkRepository.findOne({
      where: { code: code },
      relations: relations,
    });
  }

  async increaseClickNumber(shortenLink: ShortLinkEntity): Promise<void> {
    shortenLink.clicks += 1;
    await this.shortLinkRepository.save(shortenLink);
  }

  private parseOriginalLink(link: string): Partial<OriginalLinkEntity> {
    const urlObj = new URL(link);
    return {
      protocol: urlObj.protocol,
      search: urlObj.search,
      host: urlObj.host,
      pathname: urlObj.pathname,
    };
  }

  private transformLinks(links: ShortLinkEntity[]) {
    const transformedLinks = links.map((link) => {
      const { protocol, host, pathname, search } = link.originalLink;
      const originalLink = protocol + '//' + host + pathname + search;
      const { code, ...newLink } = link;
      return {
        ...newLink,
        shortLink: API_CONFIG.url + '/' + code,
        status: link.status.type,
        originalLink: originalLink,
      };
    });
    return transformedLinks;
  }
}
