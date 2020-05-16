import { Request, Response, Next } from 'restify';
import { injectable, inject, named } from 'inversify';
import { Controller, Get, Post } from 'inversify-restify-utils';
import { Logger } from 'pino';

import { TYPE } from '@types';
import { BaseController } from '@controllers/base/BaseController';
import { UserService } from '@services/UserService';

@injectable()
@Controller('/users')
export class UserController extends BaseController {
  constructor(
    @inject(TYPE.Service) @named('User') private service: UserService,
    @inject('logger') private logger: Logger,
  ) {
    super();
  }

  @Get('/:userId')
  public async getUser(req: Request, res: Response, next: Next): Promise<void> {
    try {
      const user = await this.service.getOne(req.params.userId);
      res.json(200, user);
      next();
    } catch (err) {
      this.logger.error('UserController | getUser failed: %s', err);
      next(err);
    }
  }

  @Post('/')
  public async createUser(req: Request, res: Response, next: Next): Promise<void> {
    try {
      const user = await this.service.createOne(req.body);
      res.json(201, user);
      next();
    } catch (err) {
      this.logger.error('UserController | createUser failed: %s', err);
      next(err);
    }
  }
}
