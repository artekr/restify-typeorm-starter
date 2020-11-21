import { injectable } from 'inversify';
import * as errors from 'restify-errors';
import { Repository as TypeOrmReposity } from 'typeorm';
import { Repository, ListParams } from '@domains/interfaces/repository';

@injectable()
export class BaseRepository<DalEntity> implements Repository<DalEntity> {

  protected repository: TypeOrmReposity<DalEntity>;

  public constructor(_repository: TypeOrmReposity<DalEntity>) {
    this.repository = _repository;
  }

  public async createOne(obj: DalEntity): Promise<DalEntity> {
    return new Promise<DalEntity>(async (resolve, reject) => {
      try {
        const entity = await this.repository.save(obj);
        return resolve(entity);
      } catch (err) {
        return reject(await this.buildMysqlError(err));
      }
    });
  }

  public async getOne(id: number): Promise<DalEntity> {
    return new Promise<DalEntity>(async (resolve, reject) => {
      try {
        const entity = await this.repository.findOne(id);
        return resolve(entity);
      } catch (err) {
        return reject(err);
      }
    });
  }

  // public async getMany(params: ListParams): Promise<DomainEntity[]> {
  // }

  public async findOneBy(params: ListParams): Promise<DalEntity> {
    return new Promise<DalEntity>(async (resolve, reject) => {
      try {
        const entity = await this.repository.findOneOrFail(params);
        return resolve(entity);
      } catch (err) {
        return reject(err);
      }
    });
  }

  private buildMysqlError(err: Error): Promise<Error> {
    return new Promise<Error>(async (resolve) => {
      if ((<any> err).errno === 1062 && (<any> err).code === 'ER_DUP_ENTRY') {
        const regex = /Duplicate entry (.*) for key (.*)/;
        const matches = regex.exec((<any> err).sqlMessage);
        if (matches !== null) {
          const value = matches[1];
          const key = matches[2];
          const error = new DuplicateError(
            `A key with value ${value} has already exist.`,
            key,
            value
          );
          return resolve(error);
        }
      }
      return resolve(err);
    });
  }
}

export class DuplicateError extends errors.ConflictError {
  public field: string;
  public value: string;

  constructor(message?: string, field?: string, value?: string) {
    super(message);
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DuplicateError);
    }
    this.name = 'DuplicateError';
    this.field = field;
    this.value = value;
  }
}
