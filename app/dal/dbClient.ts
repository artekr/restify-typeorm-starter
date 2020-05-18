import { injectable } from 'inversify';
import { Connection, createConnection } from 'typeorm';

export enum DbType {
  Mysql = 'mysql',
  MongoDB = 'mongodb',
  Postgres = 'postgres'
}

interface ConnectionOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  debug: boolean;
}

@injectable()
export class DbClient {
  private dbType: DbType;
  private connection: Connection;
  private options: ConnectionOptions;

  constructor(dbType: DbType, options: ConnectionOptions) {
    this.dbType = dbType;
    this.options = Object.assign({}, options);
  }

  public async getConnection(): Promise<Connection> {
    if (this.connection) {
      return Promise.resolve(this.connection);
    }

    const { host, port, username, password, database, debug } = this.options;

    return new Promise<Connection>(async (resolve: Function, reject: Function) => {
      try {
        const connection = await createConnection({
          type: this.dbType,
          host: host,
          port: port,
          username: username,
          password: password,
          database: database,
          entities: [__dirname + '/entities/*.ts'],
          debug: debug,
          synchronize: debug // Dev environment only!
        });
        if (!this.connection && connection) {
          this.connection = connection;
        }
        return resolve(connection);
      } catch (error) {
        return reject(error);
      }
    });
  }
}
