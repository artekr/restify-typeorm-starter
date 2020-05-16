import { InversifyRestifyServer } from 'inversify-restify-utils';
import { Server, Request, Response, Next, plugins } from 'restify';
import { IConfig } from 'config';
import { Logger } from 'pino';
import { injectable, inject } from 'inversify';

import { Registry } from './Registry';

@injectable()
export class App {
  private server: Server;
  private shutdownWaitTimeout: number;
  private isShuttingDown: boolean = false;

  constructor(
    @inject('config') private config: IConfig,
    @inject('logger') private logger: Logger
  ) {
    this.shutdownWaitTimeout = this.config.get<number>('shutdownWaitTimeout');
  }

  public async start(): Promise<App> {
    // Initialize server
    const serverBuilder = new InversifyRestifyServer(Registry.getContainer());
    serverBuilder.setConfig((server: Server) => {
      server.pre((req: Request, res: Response, next: Function) => {
        req.headers['x-request-id'] = <string> req.headers['x-request-id'] || 'x-request-id NOT SET';
        // req.xRequestId = <string> req.headers['x-request-id'];
        next();
      });

      // Load middlewares
      server.use(plugins.queryParser());
      server.use(plugins.bodyParser());
      server.pre(plugins.pre.sanitizePath());
      server.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        next();
      });
    });

    try {
      this.server = serverBuilder.build();
    } catch (err) {
      this.logger.error(err.message);
      process.exit(1);
    }

    this.showAppInfo();

    // Start server
    this.server.listen(this.config.get<number>('port'), () => {
      this.logger.info(
        '%s listening at %s', this.server.name, this.server.url
      );
    });
    return this;
  }

  public stop(): Promise<void> {
    this.isShuttingDown = true;
    return new Promise<void>((resolve, reject) => {
      setTimeout(async () => {
        try {
          await this.server.close();
          return resolve();
        } catch (err) {
          return reject(err);
        }
      }, this.shutdownWaitTimeout);
    });
  }

  public getServer(): Server {
    return this.server;
  }

  private showAppInfo(): void {
    this.server.get('/', (req: Request, res: Response, next: Next) => {
      res.send(200, {
        appId: this.config.get<string>('name'),
        appVersion: `v${process.env.npm_package_version}`,
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        nodeVersion: process.version,
        platform: process.platform
      });
      next();
    });
  }
}
