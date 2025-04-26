import { container, inject, singleton } from 'tsyringe';

import fs from 'node:fs';
import { createServer } from 'node:http';
import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { dependecyName } from '@/tools';
import { ADAPTER_ROUTING, DEP_CONFIG_ENV, PREFIX_ADAPTER_APP } from '@@const';

import { type ConfigService } from '@@app/ports/ConfigService.port';
import { type HttpApplication } from '@@app/ports/HttpService.port';

import { ExpressRouterAdapter } from './ExpressRouter.adapter';

const routing: typeof ADAPTER_ROUTING = 'express';

const DEP_EXPRESS_APP_ROUTER = dependecyName(PREFIX_ADAPTER_APP, routing);

@singleton()
export class ExpressAppAdapter
  extends ExpressRouterAdapter
  implements HttpApplication
{
  private expressApp: Express;

  constructor(
    @inject(DEP_CONFIG_ENV)
    private config: ConfigService,
  ) {
    const app = express();

    super(app);

    this.attach = this.attach.bind(this);
    this.set = this.set.bind(this);
    this.disable = this.disable.bind(this);
    this.enable = this.enable.bind(this);

    this.expressApp = app;

    app.disable('x-powered-by');

    if (this.config.NODE_ENV === 'production') {
      const accessLogStream = fs.createWriteStream(this.config.LOGGER_FILE, {
        flags: 'a',
      });
      app.use(morgan('combined'));
      app.use(morgan('combined', { stream: accessLogStream }));
    } else if (this.config.NODE_ENV === 'development') {
      app.use(morgan('dev'));
    }

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(
      express.static('/home/archiso/dev/node/express-typescript/v01/public'),
    );
  }

  public attach(server: ReturnType<typeof createServer>) {
    server.on('request', this.expressApp);
  }

  public set(name: string, value: unknown): void {
    this.expressApp.set(name, value);
  }

  public disable(name: string): void {
    this.expressApp.disable(name);
  }

  public enable(name: string): void {
    this.expressApp.enable(name);
  }
}

container.register(DEP_EXPRESS_APP_ROUTER, {
  useClass: ExpressAppAdapter,
});
