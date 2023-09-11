import { Injectable } from '@nestjs/common';
import {
  Provider,
  ProviderName,
  UserAuthProviderService,
  UserEntityWithoutCredentials,
  UserService,
} from '../../user';
import { CryptService } from './crypt.service';
import {
  PasswordNotMatchException,
  UserAlreadyExistException,
} from '../exceptions';
import { RegisterUserDto } from '../dto';
import { ExternalUser } from '../interfaces';
import { UserEntity } from '../../user/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly providerService: UserAuthProviderService,
    private readonly cryptService: CryptService,
  ) {}

  public async externalUser(
    user: ExternalUser,
    providerName: ProviderName,
  ): Promise<string> {
    const foundUser = await this.userService.findUserByEmail(user.email, {
      credentials: true,
    });
    const provider: Provider = {
      providerId: user.id,
      providerName,
      userInternalName: user.username,
    };
    if (!foundUser) {
      //Creating user with provider
      const { id } = await this.userService.createUser({
        username: user.username,
        email: user.email,
        photo: user.photo,
        credentials: { providers: [{ ...provider }] },
      });
      return id;
    }
    const isUserExistWithCurrentProvider =
      await this.userService.findUserWithCurrentProvider(
        foundUser.id,
        providerName,
      );
    if (!isUserExistWithCurrentProvider) {
      await this.providerService.createProvider(
        provider,
        foundUser.credentials,
      );
    }
    return foundUser.id;
  }

  public async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userService.findUserByEmail(email, {
      credentials: true,
    });
    const hashedPassword = user?.credentials.password;
    if (user && (await this.cryptService.compare(password, hashedPassword))) {
      return user;
    }
    return null;
  }

  public async registerUser(
    user: RegisterUserDto,
  ): Promise<UserEntityWithoutCredentials> {
    await this.checkIsUserExist(user.email);
    if (user.password !== user.confirmPassword) {
      throw new PasswordNotMatchException();
    }
    const hashedPassword = await this.cryptService.hash(user.password);
    const { credentials: _, ...newUser } = await this.userService.createUser({
      username: user.username,
      email: user.email,
      credentials: {
        password: hashedPassword,
      },
    });
    return newUser;
  }

  public async checkIsUserExist(email: string): Promise<UserEntity> {
    const foundUser = await this.userService.findUserByEmail(email);
    if (foundUser) {
      throw new UserAlreadyExistException();
    }
    return foundUser;
  }
}
