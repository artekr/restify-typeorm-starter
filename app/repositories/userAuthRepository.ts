import { inject, injectable, named } from 'inversify';
import { Logger } from 'pino';

import { TYPES } from '@types';
import { BaseRepository } from '@repositories/base/baseRepository';
import { UserAuthEntity } from '@dal/entities/userAuthEntity';
import { IUserAuthRepository } from '@domains/interfaces/repository';

import { DbProvider } from '../registry';

@injectable()
export class UserAuthRepository extends BaseRepository<UserAuthEntity> implements IUserAuthRepository {

  constructor(
    @inject('logger') private logger: Logger,
    @inject(TYPES.DbProvider) private mysqlProvider: DbProvider
  ) {
    super();
    this.mysqlProvider().then(connection => {
      this.repository = connection.getRepository(UserAuthEntity);
    });
  }

  public async createOne(entity: UserAuthEntity): Promise<UserAuthEntity> {
    this.logger.info('UserAuthRepository | createOne: %o', entity);
    return super.createOne(entity);
  }

  public async getOne(id: number): Promise<UserAuthEntity> {
    this.logger.info('UserAuthRepository | getOne id: %d', id);
    return super.getOne(id);
  }

  public async findOneBy(parameters: { [key: string]: any }): Promise<UserAuthEntity> {
    return super.findOneBy(Object.assign(parameters));
  }
}
