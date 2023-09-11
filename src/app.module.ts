import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { corsOptions, DATABASE_CONFIG } from '@common/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule, LinkModule, UserModule } from './modules';
import * as cors from 'cors';

@Module({
  imports: [
    TypeOrmModule.forRoot(DATABASE_CONFIG),
    UserModule,
    AuthModule,
    LinkModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors(corsOptions)).forRoutes('*');
  }
}
