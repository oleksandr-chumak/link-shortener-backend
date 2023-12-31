import { UnauthorizedException } from '@nestjs/common';

export class TokenNotFoundException extends UnauthorizedException {
  constructor() {
    super('Token not found', 'TOKEN_NOT_FOUND');
  }
}
