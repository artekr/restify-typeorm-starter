import { UserEntity } from '@dal/entities/userEntity';
import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne
} from 'typeorm';

@Entity({ name: 't_user_auth' })
export class UserAuthEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Index('idx_email', { unique: true })
  @Column()
  public email: string;

  @Index('idx_username', { unique: true })
  @Column()
  public username: string;

  @Column()
  public password: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  // tslint:disable-next-line: no-reserved-keywords
  @ManyToOne(type => UserEntity, user => user.userAuths)
  public user: UserEntity;
}
