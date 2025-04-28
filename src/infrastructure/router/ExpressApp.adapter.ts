import { container } from 'tsyringe';

import path from 'node:path';
import fs from 'node:fs';
import { createServer } from 'node:http';

import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { type ConfigService } from '@@app/ports/ConfigService.port';
import {
  type HttpErrorCallback,
  type HttpApplication,
} from '@@app/ports/HttpService.port';

import { ExpressRouterAdapter } from './ExpressRouter.adapter';

import { DepRoutingApp } from '@@const/dependencies.enum';
import { DEP_ENVIRONMENT } from '@@const/injection.enum';

export class ExpressAppAdapter
  extends ExpressRouterAdapter
  implements HttpApplication
{
  private expressApp: Express;

  constructor(private config: ConfigService) {
    const app = express();

    super(app);

    this.attach = this.attach.bind(this);
    this.set = this.set.bind(this);
    this.disable = this.disable.bind(this);
    this.enable = this.enable.bind(this);

    this.expressApp = app;

    app.disable('x-powered-by');

    if (this.config.NODE_ENV === 'production') {
      const accessLogStream = fs.createWriteStream(
        path.resolve(this.config.LOGGER_FILE),
        {
          flags: 'a',
        },
      );
      app.use(morgan('combined'));
      app.use(morgan('combined', { stream: accessLogStream }));
    } else if (this.config.NODE_ENV === 'development') {
      app.use(morgan('dev'));
    }

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    if (this.config.STATIC_DIR) {
      app.use(express.static(path.resolve(this.config.STATIC_DIR)));
    }
  }

  public error(handler: HttpErrorCallback) {
    this.expressApp.use(
      (err: unknown, req: Request, res: Response, next: NextFunction) => {
        const request = ExpressAppAdapter.requestAdapter(req);
        const response = ExpressAppAdapter.responseAdapter(res);
        const nextFunction = (error?: unknown) => {
          if (error) {
            return next(error);
          }
          return next();
        };
        handler(err, request, response, nextFunction);
      },
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

container.register<HttpApplication>(DepRoutingApp.EXPRESS, {
  useValue: new ExpressAppAdapter(
    container.resolve<ConfigService>(DEP_ENVIRONMENT),
  ),
});
