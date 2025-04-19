import { container, injectable } from 'tsyringe';

import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from 'express';

import {
  HttpFullHandlerPort,
  HttpRouterPort,
} from '@/application/route/Http.ports';
import { dependecyName } from '@/tools/dependencies.tool';
import {
  ADAPTER_ROUTING,
  PREFIX_ADAPTER_ROUTER,
} from '@/constants/dependencies.enum';

@injectable()
export class ExpressRouterAdapter implements HttpRouterPort {
  router: Router;

  constructor() {
    this.router = Router();

    this.use = this.use.bind(this);
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.delete = this.delete.bind(this);
    this.patch = this.patch.bind(this);
    this.options = this.options.bind(this);
    this.all = this.all.bind(this);
    this.build = this.build.bind(this);
  }

  private static handlerAdapter(handler: HttpFullHandlerPort) {
    return (
      error: unknown,
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      return handler(
        {
          method: req.method,
          body: req.body,
          headers: req.headers as Record<string, string>,
          params: req.params,
          path: req.path,
          query: req.query as Record<string, string | null | undefined>,
          cookies: req.cookies,
          user: 'user' in req ? req.user : undefined,
        },
        {
          json: (data: unknown) => res.json(data),
          send: (data: unknown) => res.send(data),
          status: (statusCode: number) => res.status(statusCode),
          redirect: (url: string) => res.redirect(url),
          setHeader: (name: string, value: string) => {
            res.setHeader(name, value);
          },
          setCookie: (name, value, options) => {
            if (options) {
              res.cookie(name, value, options);
            } else {
              res.cookie(name, value);
            }
          },
        },
        next,
        error,
      );
    };
  }

  build(
    method: typeof this.router.use,
    path: string | HttpFullHandlerPort,
    ...handler: HttpFullHandlerPort[]
  ) {
    if (typeof path === 'string') {
      method(path, ...handler.map(ExpressRouterAdapter.handlerAdapter));
    } else {
      method(
        ExpressRouterAdapter.handlerAdapter(path),
        ...handler.map(ExpressRouterAdapter.handlerAdapter),
      );
    }
  }

  use(path: string | HttpFullHandlerPort, ...handler: HttpFullHandlerPort[]) {
    this.build(this.router.use.bind(this.router), path, ...handler);
  }

  get(path: string | HttpFullHandlerPort, ...handler: HttpFullHandlerPort[]) {
    this.build(this.router.get.bind(this.router), path, ...handler);
  }

  post(path: string | HttpFullHandlerPort, ...handler: HttpFullHandlerPort[]) {
    this.build(this.router.post.bind(this.router), path, ...handler);
  }

  put(path: string | HttpFullHandlerPort, ...handler: HttpFullHandlerPort[]) {
    this.build(this.router.put.bind(this.router), path, ...handler);
  }

  delete(
    path: string | HttpFullHandlerPort,
    ...handler: HttpFullHandlerPort[]
  ) {
    this.build(this.router.delete.bind(this.router), path, ...handler);
  }

  patch(path: string | HttpFullHandlerPort, ...handler: HttpFullHandlerPort[]) {
    this.build(this.router.patch.bind(this.router), path, ...handler);
  }

  options(
    path: string | HttpFullHandlerPort,
    ...handler: HttpFullHandlerPort[]
  ) {
    this.build(this.router.options.bind(this.router), path, ...handler);
  }

  all(path: string | HttpFullHandlerPort, ...handler: HttpFullHandlerPort[]) {
    this.build(this.router.all.bind(this.router), path, ...handler);
  }
}

const routing: typeof ADAPTER_ROUTING = 'express';

const DEP_EXPRESS_ROUTER_ADAPTER = dependecyName(
  PREFIX_ADAPTER_ROUTER,
  routing,
);

container.register<ExpressRouterAdapter>(DEP_EXPRESS_ROUTER_ADAPTER, {
  useClass: ExpressRouterAdapter,
});
