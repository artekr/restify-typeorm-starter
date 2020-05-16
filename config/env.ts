import { resolve } from 'path';
import * as dotenv from 'dotenv';

const NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config({
  path: resolve(__dirname, `../.env.${NODE_ENV}`)
});
