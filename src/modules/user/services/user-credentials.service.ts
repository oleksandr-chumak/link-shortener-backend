import { Injectable } from '@nestjs/common';
import { UserCredentialsRepository } from '../repositories';

@Injectable()
export class UserCredentialsService {
  constructor(private userCredentialsRepository: UserCredentialsRepository) {}
}
