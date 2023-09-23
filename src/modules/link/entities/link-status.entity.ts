import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/base';
import { ShortLinkEntity } from './short-link.entity';

@Entity('link_status')
export class LinkStatusEntity extends BaseEntity {
  @Column({ unique: true })
  type: string;

  @OneToMany(() => ShortLinkEntity, (shortLink) => shortLink.status)
  shortLinks: ShortLinkEntity[];
}
