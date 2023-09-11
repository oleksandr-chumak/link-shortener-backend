import { DataSource, Repository } from 'typeorm';
import { UserCredentialsEntity } from '../entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserCredentialsRepository extends Repository<UserCredentialsEntity> {
  constructor(private dataSource: DataSource) {
    super(UserCredentialsEntity, dataSource.createEntityManager());
  }
}
