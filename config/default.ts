import './env';

const config = {
  name: 'veronica',
  version: '0.0.1',
  port: 3000,
  shutdownWaitTimeout: 3000,
  database: {
    mysql: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      username: process.env.MYSQL_USERNAME || null,
      password: process.env.MYSQL_PASSWORD || null,
      database: process.env.MYSQL_DATABASE,
      debug: process.env.MYSQL_DEBUG || false
    },
    mongodb: {
      connectionString: process.env.MONGO_CONNECTION_STRING,
      database: process.env.MONGO_DATABASE,
      username: process.env.MONGO_USERNAME || null,
      password: process.env.MONGO_PASSWORD || null,
      debug: process.env.MONGO_DEBUG || false
    }
  }
};

export = { ...config, default: config };
