import { inject, injectable, named } from 'inversify';
import { Logger } from 'pino';

import { TYPE } from '@types';
import { UserEntity } from '@dal/entities/userEntity';
import { UserDataMapper } from '@dal/dataMappers/userDataMapper';
import { User } from '@domains/entities/user';
import { IUserRepository } from '@domains/interfaces/repository';
import { BaseRepository } from '@repositories/base/baseRepository';

import { DbProvider } from '../registry';

@injectable()
export class UserRepository extends BaseRepository<User, UserEntity> implements IUserRepository {

  constructor(
    @inject('logger') private logger: Logger,
    @inject('DbProvider') private mysqlProvider: DbProvider,
    @inject(TYPE.DataMapper) @named('User') protected dataMapper: UserDataMapper
  ) {
    super(dataMapper);
    this.mysqlProvider().then(connection => {
      this.repository = connection.getRepository(UserEntity);
    });
  }

  public async createOne(obj: User): Promise<User> {
    this.logger.info('UserRepository | createOne');
    return super.createOne(obj);
  }

  public async getOne(id: number): Promise<User> {
    this.logger.info('UserRepository | getOne id: %d', id);
    return super.getOne(id);
  }

  public async findOneBy(parameters: { [index: string]: any }): Promise<UserEntity> {
    return await this.repository.findOne(Object.assign(parameters));
  }
}
