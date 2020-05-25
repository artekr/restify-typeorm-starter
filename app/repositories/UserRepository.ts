import { inject, injectable } from 'inversify';
import { Logger } from 'pino';

import { TYPES } from '@types';
import { UserEntity } from '@dal/entities/userEntity';
import { IUserRepository } from '@domains/interfaces/repository';
import { BaseRepository } from '@repositories/base/baseRepository';

import { DbProvider } from '../registry';

@injectable()
export class UserRepository extends BaseRepository<UserEntity> implements IUserRepository {

  constructor(
    @inject('logger') private logger: Logger,
    @inject(TYPES.DbProvider) private mysqlProvider: DbProvider
  ) {
    super();
    this.mysqlProvider().then(connection => {
      this.repository = connection.getRepository(UserEntity);
    });
  }

  public async createOne(entity: UserEntity): Promise<UserEntity> {
    this.logger.info('UserRepository | createOne: %o', entity);
    return super.createOne(entity);
  }

  public async getOne(id: number): Promise<UserEntity> {
    this.logger.info('UserRepository | getOne id: %d', id);
    return super.getOne(id);
  }

  public async findOneBy(parameters: { [key: string]: any }): Promise<UserEntity> {
    return super.findOneBy(Object.assign(parameters));
  }
}
