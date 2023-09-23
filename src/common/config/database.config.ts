import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  ShortLinkEntity,
  UserAuthProviderEntity,
  UserCredentialsEntity,
  UserEntity,
} from '../../modules';
import * as process from 'process';
import { OriginalLinkEntity } from '../../modules/link/entities/original-link.entity';
import { LinkStatusEntity } from '../../modules/link/entities/link-status.entity';

import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const DATABASE_CONFIG: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [
    UserEntity,
    UserCredentialsEntity,
    UserAuthProviderEntity,
    ShortLinkEntity,
    OriginalLinkEntity,
    LinkStatusEntity,
  ],
  migrationsTableName: 'migration',
  synchronize: true,
  ssl: process.env.NODE_ENV === 'production',
};
