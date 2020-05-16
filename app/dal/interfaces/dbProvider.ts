import { Connection } from 'typeorm';

interface ConnectionOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  debug: boolean;
}

export abstract class DbProvider {
  protected connection: Connection;
  protected options: ConnectionOptions;

  constructor(options: ConnectionOptions) {
    this.options = Object.assign({}, options);
  }

  public abstract async getConnection(): Promise<Connection>;
}
