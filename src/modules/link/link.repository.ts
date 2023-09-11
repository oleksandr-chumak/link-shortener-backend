import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ShortLinkEntity } from './short-link.entity';

@Injectable()
export class LinkRepository extends Repository<ShortLinkEntity> {
  constructor(private dataSource: DataSource) {
    super(ShortLinkEntity, dataSource.createEntityManager());
  }
}
