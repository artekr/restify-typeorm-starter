import { injectable, inject, named } from 'inversify';
import { Logger } from 'pino';

import { TYPE } from '@types';
import { UserRepository } from '@repositories/UserRepository';
import { User } from '@domains/entities/user';

export interface CustomerServiceParams {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

@injectable()
export class UserService {
  constructor(
    @inject('logger') private logger: Logger,
    @inject(TYPE.Repository) @named('User') private repository: UserRepository
  ) {}

  public async createOne(obj: CustomerServiceParams): Promise<User> {
    this.logger.info('UserService | createOne');
    const newUser = <User> {
      email: obj.email,
      username: obj.username,
      firstName: obj.firstName,
      lastName: obj.lastName
    };

    this.logger.info('  New user created: %s', newUser);
    return await this.repository.createOne(newUser);
  }

  public async getOne(id: number): Promise<User> {
    this.logger.info('UserService | getOne id: %d', id);
    return await this.repository.getOne(id);
  }
}
