import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LinkStatusEntity } from '../entities/link-status.entity';

@Injectable()
export class LinkStatusRepository extends Repository<LinkStatusEntity> {
  constructor(private dataSource: DataSource) {
    super(LinkStatusEntity, dataSource.createEntityManager());
  }
}
