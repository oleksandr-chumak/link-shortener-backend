import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OriginalLinkRepository extends Repository<OriginalLinkRepository> {
  constructor(private dataSource: DataSource) {
    super(OriginalLinkRepository, dataSource.createEntityManager());
  }
}
