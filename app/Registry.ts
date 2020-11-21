import 'reflect-metadata';

import * as config from 'config';
import { IConfig } from 'config';
import * as pino from 'pino';
import { Logger } from 'pino';
import { Container, AsyncContainerModule } from 'inversify';
import { interfaces } from 'inversify-restify-utils';
import { Connection } from 'typeorm';

import { App } from './app';
import { TYPES } from '@types';
import { DbClient, DbType } from '@dal/dbClient';
import { UserAuthController } from '@controllers/userAuthController';
import { UserController } from '@controllers/userController';
import { UserService } from '@services/userService';
import { UserAuthService } from '@services/userAuthService';
import { UserDataMapper } from '@dal/dataMappers/userDataMapper';
import { UserRepository } from '@repositories/userRepository';
import { UserAuthRepository } from '@repositories/userAuthRepository';

export class Registry {
  private static instance: Registry;
  private container: Container;

  private constructor() {
    this.container = new Container();
  }

  public static getInstance(): Registry {
    if (!Registry.instance) {
      Registry.instance = new Registry();
    }
    return Registry.instance;
  }

  public static async getContainer(): Promise<Container> {
    const { container } = Registry.getInstance();

    // Return the container if already bind
    if (container.isBound(App)) {
      return container;
    }

    // Bind App
    container.bind(App).toSelf().inSingletonScope();

    // Bind middlewares
    container.bind<IConfig>('config').toConstantValue(config);
    const logger = pino({
      name: config.get<string>('name'),
      prettyPrint: {
        colorize: true,
        translateTime: true
      },
      level: 'debug'
    });
    container.bind<Logger>('logger').toConstantValue(logger);

    const debug = config.get<string>('database.mysql.debug') === 'true' || config.get<boolean>('database.mysql.debug') === true;
    const mysql = new DbClient(DbType.Mysql, {
      host: config.get<string>('database.mysql.host'),
      port: config.get<number>('database.mysql.port'),
      username: config.get<string>('database.mysql.username'),
      password: config.get<string>('database.mysql.password'),
      database: config.get<string>('database.mysql.database'),
      debug: debug
    });
    await container.loadAsync(
      new AsyncContainerModule(async (bind) => {
        const connection = await mysql.getConnection();
        bind<Connection>(TYPES.DBConnection).toConstantValue(connection);
      })
    );

    // Bind controllers
    container.bind<interfaces.Controller>(TYPES.Controller).to(UserAuthController).whenTargetNamed('UserAuthController');
    container.bind<interfaces.Controller>(TYPES.Controller).to(UserController).whenTargetNamed('UserController');

    // Bind services
    container.bind<UserAuthService>(TYPES.Service).to(UserAuthService).inSingletonScope().whenTargetNamed('UserAuth');
    container.bind<UserService>(TYPES.Service).to(UserService).inSingletonScope().whenTargetNamed('User');

    // Bind repositories
    container.bind<UserRepository>(TYPES.Repository).to(UserRepository).inSingletonScope().whenTargetNamed('User');
    container.bind<UserAuthRepository>(TYPES.Repository).to(UserAuthRepository).inSingletonScope().whenTargetNamed('UserAuth');

    // Bind data mappers
    container.bind<UserDataMapper>(TYPES.DataMapper).to(UserDataMapper).inSingletonScope().whenTargetNamed('User');

    return container;
  }
}
