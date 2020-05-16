import { TYPE as RestifyTypes } from 'inversify-restify-utils'

// tslint:disable export-name
export const TYPE = {
  Controller: RestifyTypes.Controller,
  Gateway: Symbol.for('Gateway'),
  Service: Symbol.for('Service'),
  Repository: Symbol.for('Repository'),
  DataMapper: Symbol.for('DataMapper')
}
