import { UserEntity } from '@dal/entities/userEntity';
import { UserAuthEntity } from '@dal/entities/userAuthEntity';

export type Query<T> = {
  [P in keyof T]?: T[P] | { $regex: RegExp };
};

export interface ListParams {
  [key: string]: any;
}

export interface Repository<T> {
  createOne(obj: T): Promise<T>;
  getOne(id: number): Promise<T>;
  // getMany(params: ListParams): Promise<T[]>;
  findOneBy(params: ListParams): Promise<T>;
  // to do
  // findManyByQuery(query?: Query<T>): Promise<T[]>;
}

export interface IUserRepository extends Repository<UserEntity> {
  // @todo To add more user related queries
}

export interface IUserAuthRepository extends Repository<UserAuthEntity> {
  // @todo To add more userAuth related queries
}
