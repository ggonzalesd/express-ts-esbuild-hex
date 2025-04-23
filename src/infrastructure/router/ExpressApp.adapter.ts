import { container, injectable } from 'tsyringe';

import { createServer } from 'node:http';
import express, { Express } from 'express';

import { dependecyName } from '@/tools';
import { ADAPTER_ROUTING, PREFIX_ADAPTER_APP } from '@/constants';

import { type HttpApplication } from '@@app/ports/HttpService.port';

import { ExpressRouterAdapter } from './ExpressRouter.adapter';

const routing: typeof ADAPTER_ROUTING = 'express';

const DEP_EXPRESS_APP_ROUTER = dependecyName(PREFIX_ADAPTER_APP, routing);

export class ExpressAppAdapter
  extends ExpressRouterAdapter
  implements HttpApplication
{
  private expressApp: Express;

  constructor() {
    const app = express();

    super(app);

    console.log('ExpressAppAdapter');

    this.attach = this.attach.bind(this);
    this.set = this.set.bind(this);
    this.disable = this.disable.bind(this);
    this.enable = this.enable.bind(this);

    this.expressApp = app;

    app.disable('x-powered-by');

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
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
  useValue: new ExpressAppAdapter(),
});
