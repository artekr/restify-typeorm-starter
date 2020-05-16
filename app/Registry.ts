import 'reflect-metadata';

import * as config from 'config';
import { IConfig } from 'config';
import * as pino from 'pino';
import { Logger } from 'pino';
import { Container } from 'inversify';
import { interfaces } from 'inversify-restify-utils';
import { Connection } from 'typeorm';

import { App } from './App';
import { TYPE } from '@types';
import { DbClient, DbType } from '@dal/dbClient';
import { AuthController } from '@controllers/AuthController';
import { UserController } from '@controllers/UserController';
import { UserService } from '@services/UserService';
import { AuthService } from '@services/AuthService';
import { UserDataMapper } from '@dal/dataMappers/userDataMapper';
import { UserRepository } from '@repositories/UserRepository';

export type DbProvider = () => Promise<Connection>;

export class Registry {
  private static instance: Registry;
  private container: Container;

  private constructor() {
    this.container = new Container();
    // Bindings
    this.bindApp();
    this.bindConfig();
    this.bindLogger();
    this.bindMysqlConnection();

    this.bindRepositories();
    this.bindServices();
    this.bindControllers();
    this.bindDataMappers();
  }

  public static getInstance(): Registry {
    if (!Registry.instance) {
      Registry.instance = new Registry();
    }
    return Registry.instance;
  }

  public static getContainer(): Container {
    return Registry.getInstance().container;
  }

  // Bindings
  private bindApp(): void {
    this.container.bind(App).toSelf().inSingletonScope();
  }

  private bindConfig(): void {
    this.container.bind<IConfig>('config').toConstantValue(config);
  }

  private bindLogger(): void {
    const logger = pino({
      name: config.get<string>('name'),
      prettyPrint: {
        colorize: true,
        translateTime: true
      },
      level: 'debug'
    });
    this.container.bind<Logger>('logger').toConstantValue(logger);
  }

  private bindMysqlConnection(): void {
    /** Bind the mysql connection */
    const debug = config.get<string>('database.mysql.debug') === 'true' || config.get<boolean>('database.mysql.debug') === true;
    const mysql = new DbClient(DbType.Mysql, {
      host: config.get<string>('database.mysql.host'),
      port: config.get<number>('database.mysql.port'),
      username: config.get<string>('database.mysql.username'),
      password: config.get<string>('database.mysql.password'),
      database: config.get<string>('database.mysql.database'),
      debug: debug
    });
    this.container.bind<DbProvider>('DbProvider').toProvider<Connection>(context => {
      return async () => {
        return await mysql.getConnection();
      };
    });
  }

  private bindControllers(): void {
    this.container.bind<interfaces.Controller>(TYPE.Controller).to(AuthController).whenTargetNamed('AuthController');
    this.container.bind<interfaces.Controller>(TYPE.Controller).to(UserController).whenTargetNamed('UserController');
  }

  private bindServices(): void {
    this.container.bind<AuthService>(TYPE.Service).to(AuthService).inSingletonScope().whenTargetNamed('Auth');
    this.container.bind<UserService>(TYPE.Service).to(UserService).inSingletonScope().whenTargetNamed('User');
  }

  private bindRepositories(): void {
    this.container.bind<UserRepository>(TYPE.Repository).to(UserRepository).inSingletonScope().whenTargetNamed('User');
  }

  private bindDataMappers(): void {
    this.container.bind<UserDataMapper>(TYPE.DataMapper).to(UserDataMapper).inSingletonScope().whenTargetNamed('User');
  }
}
