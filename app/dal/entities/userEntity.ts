import {
  Entity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
import { Length, IsEmail } from 'class-validator';

@Entity()
@Unique(['username', 'email'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @IsEmail()
  public email: string;

  @Column()
  @Length(4, 20)
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
}
