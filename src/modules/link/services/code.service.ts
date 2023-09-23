import { Injectable } from '@nestjs/common';
import { ShortLinkRepository } from '../repositories';

@Injectable()
export class CodeService {
  constructor(private shortLinkRepository: ShortLinkRepository) {}

  async ensureUniqueShortLinkCode(): Promise<string> {
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
    const shortenLink = await this.shortLinkRepository.findOneBy({
      code: code,
    });
    return !shortenLink;
  }
}
