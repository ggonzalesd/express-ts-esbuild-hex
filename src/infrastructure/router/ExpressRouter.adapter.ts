import { container, inject, injectable } from 'tsyringe';

import express, {
  Router,
  type NextFunction,
  type Request,
  type Response,
  type IRouter,
} from 'express';

import {
  HttpMethods,
  type HttpCallback,
  type HttpHandler,
  type HttpRequest,
  type HttpResponse,
  type HttpRouter,
} from '@@app/ports/HttpService.port';

import { DepRoutingRouter } from '@@const/dependencies.enum';

const expressRouterFactory = (): IRouter => {
  return express.Router();
};
const DEP_EXPRESS_ROUTER_FACTORY = 'dep-express-router-factory';
container.register<IRouter>(DEP_EXPRESS_ROUTER_FACTORY, {
  useFactory: expressRouterFactory,
});

@injectable({ token: DepRoutingRouter.EXPRESS })
export class ExpressRouterAdapter implements HttpRouter {
  public expressRouter: IRouter;

  constructor(@inject(DEP_EXPRESS_ROUTER_FACTORY) router?: IRouter | null) {
    if (router == null) router = Router();

    this.expressRouter = router;
  }

  public static requestAdapter(req: Request): HttpRequest {
    return {
      method: req.method,
      getBody: () => req.body,
      headers: req.headers as Record<string, string>,
      params: req.params,
      path: req.path,
      query: req.query as Record<string, string | null | undefined>,
      cookies: req.cookies,
      getUser: () => ('user' in req ? req.user : undefined),
      setUser: (user: unknown) => {
        (req as unknown as { user: unknown }).user = user;
      },
    };
  }

  public static responseAdapter(res: Response): HttpResponse {
    const response: HttpResponse = {
      json: (data: unknown) => res.json(data),
      send: (data: unknown) => res.send(data),
      status: (statusCode: number) => {
        res.status(statusCode);
        return response;
      },
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
    };
    return response;
  }

  private adapter(handler: HttpCallback | HttpRouter) {
    if (typeof handler !== 'function') {
      let router: Router | null = null;

      if ('expressRouter' in handler && handler.expressRouter != null) {
        router = handler['expressRouter'] as unknown as Router;
      } else throw new Error('Invalid Express handler provided');

      return router;
    }

    return (req: Request, res: Response, next: NextFunction) => {
      return handler(
        ExpressRouterAdapter.requestAdapter(req),
        ExpressRouterAdapter.responseAdapter(res),
        next,
      );
    };
  }

  handler: HttpHandler = (options, ...handlers) => {
    const ops = options ?? 'USE';

    // eslint-disable-next-line prefer-const
    let [method = 'USE', path] = ops.split(' ', 2) as [
      (typeof HttpMethods)[number] | undefined,
      string | undefined,
    ];

    if (!HttpMethods.includes(method)) {
      throw new Error(`Method ${method} not supported`);
    }
    const expressMethod = method.toLowerCase() as keyof Router;

    const adapters = handlers.map(this.adapter);

    const router = Object.assign(this.expressRouter, {
      methodfn: this.expressRouter[expressMethod] as IRouter['use'],
    });

    if (path) {
      router.methodfn(path, ...adapters);
    } else {
      router.methodfn(...adapters);
    }
  };
}
