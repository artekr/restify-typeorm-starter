import { injectable, inject, named } from 'inversify';
import * as bcrypt from 'bcrypt';
import { Logger } from 'pino';

import { TYPES } from '@types';
import { generateJWT } from '@middlewares/jwt';
import { CreateUserDTO } from '@domains/dto/users/createUserDTO';
import { User } from '@domains/models/user';
import { UserEntity } from '@dal/entities/userEntity';
import { UserAuthEntity } from '@dal/entities/userAuthEntity';
import { UserDataMapper } from '@dal/dataMappers/userDataMapper';
import { UserRepository } from '@repositories/userRepository';
import { UserAuthRepository } from '@repositories/userAuthRepository';

@injectable()
export class UserService {
  constructor(
    @inject('logger') private logger: Logger,
    @inject(TYPES.Repository) @named('User') private userRepository: UserRepository,
    @inject(TYPES.Repository) @named('UserAuth') private userAuthRepository: UserAuthRepository,
    @inject(TYPES.DataMapper) @named('User') private dataMapper: UserDataMapper
  ) {}

  public async createOne(dto: CreateUserDTO): Promise<User> {
    this.logger.info('UserService | createOne: %o', dto);
    const { email, username, password, firstName, lastName } = dto;

    // @todo: Could user Transaction: https://typeorm.io/#/transactions

    const userEntity = new UserEntity();
    userEntity.email = email;
    userEntity.username = username;
    userEntity.firstName = firstName;
    userEntity.lastName = lastName;
    const newUser = await this.userRepository.createOne(userEntity);

    const hashedPassword = await bcrypt.hash(password, 10);
    const userAuth = new UserAuthEntity();
    userAuth.email = email;
    userAuth.username = username;
    userAuth.password = hashedPassword;
    userAuth.user = newUser;
    await this.userAuthRepository.createOne(userAuth);

    this.logger.info('  New user created: %o', userEntity);

    const user = this.dataMapper.toDomain(userEntity);
    user.token = generateJWT(user.id, user.username, user.email);
    return user;
  }

  public async getOne(id: number): Promise<User> {
    this.logger.info('UserService | getOne id: %d', id);
    const userEntity = await this.userRepository.getOne(id);
    return this.dataMapper.toDomain(userEntity);
  }
}
