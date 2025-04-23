import { container } from 'tsyringe';

import {
  Router,
  type NextFunction,
  type Request,
  type Response,
  type IRouter,
} from 'express';

import { dependecyName } from '@@tool';
import { ADAPTER_ROUTING, PREFIX_ADAPTER_ROUTER } from '@@const';

import {
  HttpMethods,
  type HttpCallback,
  type HttpHandler,
  type HttpRequest,
  type HttpResponse,
  type HttpRouter,
} from '@@app/ports/HttpService.port';

const routing: typeof ADAPTER_ROUTING = 'express';

const DEP_EXPRESS_ROUTER_ADAPTER = dependecyName(
  PREFIX_ADAPTER_ROUTER,
  routing,
);

export class ExpressRouterAdapter implements HttpRouter {
  public expressRouter: IRouter;

  constructor(router?: IRouter | null) {
    if (router == null) router = Router();

    this.expressRouter = router;
  }

  private static requestAdapter(req: Request): HttpRequest {
    return {
      method: req.method,
      body: req.body,
      headers: req.headers as Record<string, string>,
      params: req.params,
      path: req.path,
      query: req.query as Record<string, string | null | undefined>,
      cookies: req.cookies,
      user: 'user' in req ? req.user : undefined,
    };
  }

  private static responseAdapter(res: Response): HttpResponse {
    return {
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
    };
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

  s = 0;

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

container.register(DEP_EXPRESS_ROUTER_ADAPTER, {
  useFactory: () => {
    const router = Router();
    return new ExpressRouterAdapter(router);
  },
});
