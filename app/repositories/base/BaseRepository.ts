import { injectable, unmanaged } from 'inversify';
import { Repository as TypeOrmReposity } from 'typeorm';
import { Repository } from '@domains/interfaces/repository';
import { EntityDataMapper } from '@dal/interfaces/entityDataMapper';

@injectable()
export class BaseRepository<DomainEntity, DalEntity> implements Repository<DomainEntity> {

  protected repository: TypeOrmReposity<DalEntity>;
  protected readonly dataMapper: EntityDataMapper<DomainEntity, DalEntity>;

  public constructor(
    @unmanaged() dataMapper: EntityDataMapper<DomainEntity, DalEntity>
  ) {
    this.dataMapper = dataMapper;
  }

  public async createOne(obj: DomainEntity): Promise<DomainEntity> {
    return new Promise<DomainEntity>(async (resolve, reject) => {
      try {
        const entity = await this.repository.save(this.dataMapper.toDalEntity(obj));
        return resolve(this.dataMapper.toDomain(entity));
      } catch (err) {
        return reject(err);
      }
    });
  }
  public async getOne(id: number): Promise<DomainEntity> {
    return new Promise<DomainEntity>(async (resolve, reject) => {
      try {
        const entity = await this.repository.findOne(id);
        return resolve(this.dataMapper.toDomain(entity));
      } catch (err) {
        return reject(err);
      }
    });
  }

  // public async getMany(params: ListParams): Promise<DomainEntity[]> {
  // }

  // public async findOneBy(params: ListParams): Promise<DomainEntity> {
  // }
}
