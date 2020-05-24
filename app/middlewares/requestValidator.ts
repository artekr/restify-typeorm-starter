import { Request, Response, Next } from 'restify';
import * as errors from 'restify-errors';
import { plainToClass } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';

export const RequestValidator = (dtoClass: any) => {
  return (req: Request, res: Response, next: Next) => {
    const object = plainToClass(dtoClass, req.body);
    validateOrReject(object, { skipMissingProperties: true })
      .catch(errs => {
        const result: { [k: string]: string } = {};
        errs.forEach((el: ValidationError) => {
          const prop = el.property;
          Object.entries(el.constraints).forEach(constraint => {
            result[prop] = `${constraint[1]}`;
          });
        });
        return next(new errors.BadRequestError(JSON.stringify(result)));
      }).then(() => next());
  };
};
