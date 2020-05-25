import { Request, Response, Next } from 'restify';
import { injectable, inject, named } from 'inversify';
import { Controller, Get, Post } from 'inversify-restify-utils';
import { Logger } from 'pino';
import * as errors from 'restify-errors';

import { TYPES } from '@types';
import { RequestValidator } from '@middlewares/requestValidator';
import { BaseController } from '@controllers/base/baseController';
import { UserService } from '@services/userService';
import { CreateUserDTO } from '@domains/dto/users/createUserDTO';
import { User } from '@domains/models/user';

@Controller('/users')
@injectable()
export class UserController extends BaseController {
  constructor(
    @inject('logger') private logger: Logger,
    @inject(TYPES.Service) @named('User') private service: UserService
  ) {
    super();
  }

  @Post('/', RequestValidator(CreateUserDTO))
  public async createUser(req: Request, res: Response, next: Next): Promise<void> {
    try {
      const user: User = await this.service.createOne(<CreateUserDTO> req.body);
      res.json(201, user);
      return next();
    } catch (err) {
      this.logger.error('UserController | createUser failed: %s', err);
      return next(err);
    }
  }

  @Get('/:userId')
  public async getUser(req: Request, res: Response, next: Next): Promise<void> {
    try {
      const user: User = await this.service.getOne(req.params.userId);
      res.json(200, user);
      return next();
    } catch (err) {
      this.logger.error('UserController | getUser failed: %s', err);
      return next(new errors.ResourceNotFoundError('Could not found user with id: %d', req.params.userId));
    }
  }
}
