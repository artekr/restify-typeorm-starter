import { injectable, inject, named } from 'inversify';
import { Controller } from 'inversify-restify-utils';

import { TYPE } from '@types';
import { BaseController } from '@controllers/base/baseController';
import { SessionService } from '@services/sessionService';

@injectable()
@Controller('/sessions')
export class SessionController extends BaseController {
  constructor(
    @inject(TYPE.Service) @named('Session') private sessionService: SessionService
  ) {
    super();
  }
}
