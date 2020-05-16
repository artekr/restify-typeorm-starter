import { injectable } from 'inversify';

import { EntityDataMapper } from '@dal/interfaces/entityDataMapper';
import { User } from '@domains/entities/user';
import { UserEntity } from '@dal/entities/userEntity';

@injectable()
export class UserDataMapper implements EntityDataMapper<User, UserEntity> {
  public toDomain(entity: UserEntity): User {
    return new User({
      id: entity.id,
      email: entity.email,
      username: entity.username,
      firstName: entity.firstName,
      lastName: entity.lastName
    });
  }

  public toDalEntity(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.email = domain.email;
    entity.username = domain.username;
    entity.firstName = domain.firstName;
    entity.lastName = domain.lastName;
    return entity;
  }
}
