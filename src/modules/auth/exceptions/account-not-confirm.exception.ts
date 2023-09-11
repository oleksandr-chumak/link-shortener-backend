import { UnauthorizedException } from '@nestjs/common';

export class AccountNotConfirmException extends UnauthorizedException {
  constructor() {
    super('Account is not confirmed');
  }
}
