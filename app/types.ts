import { TYPE as RestifyTypes } from 'inversify-restify-utils';

// tslint:disable export-name
export const TYPES = {
  Controller: RestifyTypes.Controller,
  DBConnection: Symbol.for('DBConnection'),
  Gateway: Symbol.for('Gateway'),
  Service: Symbol.for('Service'),
  Repository: Symbol.for('Repository'),
  DataMapper: Symbol.for('DataMapper')
};
