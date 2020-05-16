import { User } from '@domains/entities/user';

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
  // findOneBy(params: ListParams): Promise<T>;
  // to do
  // findManyByQuery(query?: Query<T>): Promise<T[]>;
}

export interface IUserRepository extends Repository<User> {

}
