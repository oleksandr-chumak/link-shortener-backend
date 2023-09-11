import { BadRequestException } from '@nestjs/common';

export class SamePasswordException extends BadRequestException {
  constructor() {
    super('New and old password match');
  }
}
