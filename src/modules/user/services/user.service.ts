import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { UserEntity } from '../entities';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { DeepPartial } from 'typeorm';
import { ProviderName } from '../enum';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  createUser(user: DeepPartial<UserEntity>): Promise<UserEntity> {
    return this.userRepository.save({ ...user });
  }
  findUserByEmail(
    email: string,
    relations?: FindOptionsRelations<UserEntity>,
  ): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { email },
      relations,
    });
  }
  findUserById(
    id: string,
    relations?: FindOptionsRelations<UserEntity>,
  ): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id },
      relations,
    });
  }
  save(entities: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(entities);
  }
  findUserWithCurrentProvider(
    userId: string,
    providerName: ProviderName,
  ): Promise<UserEntity> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.credentials', 'uc', 'uc.id = user.credentialsId')
      .leftJoin('user_auth_provider', 'uap', 'uap.credentialsId = uc.id')
      .where('user.id = :userId', { userId })
      .andWhere('uap.providerName = :providerName', { providerName });
    return queryBuilder.getOne();
  }
}
