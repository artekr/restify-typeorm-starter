import { BaseModel } from './baseModel';

export class User extends BaseModel {
  public id: number;
  public email: string;
  public username: string;
  public firstName: string;
  public lastName: string;
}
