import { Request, Response, Next } from 'restify';
import { injectable, inject, named } from 'inversify';
import { Controller, Post } from 'inversify-restify-utils';

import { TYPES } from '@types';
import { BaseController } from '@controllers/base/baseController';
import { UserAuthService } from '@services/userAuthService';
import { RequestValidator } from '@middlewares/requestValidator';
import { LoginUserDTO } from '@domains/dto/users/loginUserDTO';
import { User } from '@domains/models/user';

@injectable()
@Controller('/auth')
export class UserAuthController extends BaseController {
  constructor(
    @inject(TYPES.Service) @named('UserAuth') private userAuthService: UserAuthService
  ) {
    super();
  }

  @Post('/', RequestValidator(LoginUserDTO))
  public async authUser(req: Request, res: Response, next: Next): Promise<void> {
    try {
      const user: User = await this.userAuthService.getOneBy(<LoginUserDTO> req.body);
      res.json(200, user);
      return next();
    } catch (err) {
      return next(err);
    }
  }
}
