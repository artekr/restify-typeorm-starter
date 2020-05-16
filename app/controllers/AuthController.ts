import { injectable, inject, named } from 'inversify';
import { Controller } from 'inversify-restify-utils';

import { TYPE } from '@types';
import { BaseController } from '@controllers/base/BaseController';
import { AuthService } from '@services/AuthService';

@injectable()
@Controller('/auth')
export class AuthController extends BaseController {
  constructor(
    @inject(TYPE.Service) @named('Auth') private authService: AuthService
  ) {
    super();
  }
}
