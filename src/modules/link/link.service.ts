import { Injectable } from '@nestjs/common';
import { LinkRepository } from './link.repository';
import { ShortLinkEntity } from './short-link.entity';

@Injectable()
export class LinkService {
  constructor(private readonly linkRepository: LinkRepository) {}

  async shortenLink(link: string, userId?: string): Promise<string> {
    const code = await this.ensureUniqueShortLinkCode();

    await this.linkRepository.save({
      code: code,
      original_link: link,
      user: userId ? { id: userId } : null,
    });

    return code;
  }

  getUserShortenLinks(userId: string) {
    return this.linkRepository.findBy({
      user: { id: userId },
    });
  }

  async findShortenLinkByCode(code: string) {
    return this.linkRepository.findOneBy({ code: code });
  }

  async increaseClickNumber(shortenLink: ShortLinkEntity): Promise<void> {
    shortenLink.clicks += 1;
    await this.linkRepository.save(shortenLink);
  }

  private async ensureUniqueShortLinkCode(): Promise<string> {
    let code = this.generateShortenLinkCode();
    let isCodeUnique = false;
    while (isCodeUnique === false) {
      isCodeUnique = await this.checkUniqueShortLinkCode(code);
      if (isCodeUnique === false) {
        code = this.generateShortenLinkCode();
      }
    }
    return code;
  }

  private generateShortenLinkCode(): string {
    const codeLength = 5;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let code = '';

    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  }

  private async checkUniqueShortLinkCode(code: string): Promise<boolean> {
    const shortenLink = await this.linkRepository.findOneBy({ code: code });
    return !shortenLink;
  }
}
