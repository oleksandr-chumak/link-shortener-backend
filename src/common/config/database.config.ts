import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  UserAuthProviderEntity,
  UserCredentialsEntity,
  UserEntity,
} from '../../modules/user/entities';
import * as process from 'process';
console.log(process.env.MYSQL_DATABASE);
console.log(process.env.PORT);
console.log(process.env.PORT);
console.log(process.env.PORT);
console.log(process.env.PORT);
console.log(process.env.PORT);

export const DATABASE_CONFIG: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [UserEntity, UserCredentialsEntity, UserAuthProviderEntity],
  migrationsTableName: 'migration',
  synchronize: true,
  ssl: process.env.NODE_ENV === 'production',
};
