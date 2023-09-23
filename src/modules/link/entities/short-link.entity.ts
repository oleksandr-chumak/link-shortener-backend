import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '@common/base';
import { UserEntity } from '../../user';
import { OriginalLinkEntity } from './original-link.entity';
import { LinkStatusEntity } from './link-status.entity';

@Entity('short_link')
export class ShortLinkEntity extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column({ default: 0 })
  clicks: number;

  @ManyToOne(() => UserEntity, (user) => user.shortLinks)
  user: UserEntity;

  @ManyToOne(() => LinkStatusEntity, (status) => status.shortLinks)
  status: LinkStatusEntity;

  @OneToOne(() => OriginalLinkEntity, { cascade: true })
  @JoinColumn()
  originalLink: OriginalLinkEntity;
}
