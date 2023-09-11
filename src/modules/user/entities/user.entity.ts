import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '@common/base';
import { UserCredentialsEntity } from './user-credentials.entity';
import { ShortLinkEntity } from '../../link';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column()
  username: string;
  @Column({ unique: true })
  email: string;
  @OneToOne(() => UserCredentialsEntity, (credentials) => credentials.user, {
    cascade: true,
  })
  @JoinColumn()
  credentials: UserCredentialsEntity;

  @OneToMany(() => ShortLinkEntity, (shortLink) => shortLink.user)
  shortLinks: ShortLinkEntity[];
  @Column({ nullable: true })
  photo: string;
}
