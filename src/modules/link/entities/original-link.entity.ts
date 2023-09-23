import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@common/base';

@Entity('original_link')
export class OriginalLinkEntity extends BaseEntity {
  @Column()
  protocol: string;

  @Column()
  host: string;

  @Column()
  pathname: string;

  @Column()
  search: string;
}
