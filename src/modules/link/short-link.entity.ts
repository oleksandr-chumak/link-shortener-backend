import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/base';
import { UserEntity } from '../user';
import { LinkStatus } from './link.types';

@Entity('short_link')
export class ShortLinkEntity extends BaseEntity {
  @Column({ unique: true })
  code: string;
  @Column()
  original_link: string;
  @Column({ default: 0 })
  clicks: number;
  @Column({ default: 'active' })
  status: LinkStatus;
  @ManyToOne(() => UserEntity, (user) => user.shortLinks)
  user: UserEntity;
}
