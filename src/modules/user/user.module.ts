import { Module } from '@nestjs/common';
import {
  UserAuthProviderService,
  UserService,
  UserCredentialsService,
} from './services';
import {
  UserAuthProvidersRepository,
  UserCredentialsRepository,
  UserRepository,
} from './repositories';
import { UserController } from './controllers';

@Module({
  providers: [
    UserRepository,
    UserAuthProvidersRepository,
    UserCredentialsRepository,
    UserService,
    UserAuthProviderService,
    UserCredentialsService,
  ],
  controllers: [UserController],
  exports: [UserService, UserAuthProviderService, UserCredentialsService],
})
export class UserModule {}
