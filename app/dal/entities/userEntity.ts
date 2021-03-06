import { UserAuthEntity } from '@dal/entities/userAuthEntity';
import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany
} from 'typeorm';

@Entity({ name: 't_user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Index('idx_email', { unique: true })
  @Column()
  public email: string;

  @Index('idx_username', { unique: true })
  @Column()
  public username: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  // tslint:disable-next-line: no-reserved-keywords
  @OneToMany(type => UserAuthEntity, userAuth => userAuth.user)
  public userAuths: UserAuthEntity[];
}
