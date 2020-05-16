import { injectable } from 'inversify';
import { interfaces } from 'inversify-restify-utils';

@injectable()
export abstract class BaseController implements interfaces.Controller {
  protected contentType: any = { 'content-type': 'application/json; charset=utf-8' };
}
