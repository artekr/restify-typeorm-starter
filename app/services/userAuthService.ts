import { injectable, inject, named } from 'inversify';
import * as errors from 'restify-errors';
import * as bcrypt from 'bcrypt';
import { Logger } from 'pino';

import { TYPES } from '@types';
import { generateJWT } from '@middlewares/jwt';
import { User } from '@domains/models/user';
import { LoginUserDTO } from '@domains/dto/users/loginUserDTO';
import { UserDataMapper } from '@dal/dataMappers/userDataMapper';
import { UserRepository } from '@repositories/userRepository';
import { UserAuthRepository } from '@repositories/userAuthRepository';

@injectable()
export class UserAuthService {
  constructor(
    @inject('logger') private logger: Logger,
    @inject(TYPES.Repository) @named('User') private userRepository: UserRepository,
    @inject(TYPES.Repository) @named('UserAuth') private userAuthRepository: UserAuthRepository,
    @inject(TYPES.DataMapper) @named('User') private dataMapper: UserDataMapper
  ) {
  }

  public async getOneBy(dto: LoginUserDTO): Promise<User> {
    this.logger.info('UserAuthService | findOneBy: %o', dto);
    const { username, email, password } = dto;
    try {
      const userAuthEntity = await this.userAuthRepository.findOneBy({
        where: [
          { username: username },
          { email: email }
        ]
      });
      this.logger.debug('UserAuthService | userAuthEntity: %o', userAuthEntity);

      const isPasswordMatch = await bcrypt.compare(password, userAuthEntity.password);
      if (!isPasswordMatch) {
        this.logger.debug('UserAuthService | password is wrong');
        throw new errors.BadRequestError('Either username/email or password is wrong.');
      }

      const userEntity = await this.userRepository.findOneBy({
        where: [
          { username: username },
          { email: email }
        ]
      });
      this.logger.debug('UserAuthService | userEntity: %o', userEntity);

      const user = this.dataMapper.toDomain(userEntity);
      user.token = generateJWT(user.id, user.username, user.email);
      return user;
    } catch (error) {
      throw new errors.BadRequestError('Either username/email or password is wrong.');
    }
  }
}
