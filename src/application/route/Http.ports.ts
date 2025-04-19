interface HttpCookieOptions {
  maxAge?: number | undefined;
  signed?: boolean | undefined;
  expires?: Date | undefined;
  httpOnly?: boolean | undefined;
  path?: string | undefined;
  domain?: string | undefined;
  secure?: boolean | undefined;
  sameSite?: boolean | 'lax' | 'strict' | 'none' | undefined;
}

export interface RequestType {
  path: string;
  method: string;
  headers: Record<string, string | undefined>;
  cookies?: Record<string, string | undefined>;
  params: Record<string, string | undefined>;
  query: Record<string, string | null | undefined>;
  body: unknown;
  user?: unknown;
}

export interface ResponseType {
  status: (statusCode: number) => this;
  json: (data: unknown) => void;
  send: (data: unknown) => void;
  redirect: (url: string) => void;
  setHeader: (name: string, value: string) => void;
  setCookie?: (
    name: string,
    value: string,
    options?: HttpCookieOptions,
  ) => void;
}

export type NextPort = (err?: unknown) => ResponseType | void;

export type HttpFullHandlerPort = (
  req: RequestType,
  res: ResponseType,
  next: NextPort,
  err?: unknown,
) => void | Promise<void>;

type HttpRouterFunctionPort = (
  path: string | HttpFullHandlerPort,
  ...handler: HttpFullHandlerPort[]
) => void;

export interface HttpRouterPort {
  use: HttpRouterFunctionPort;
  get: HttpRouterFunctionPort;
  post: HttpRouterFunctionPort;
  put: HttpRouterFunctionPort;
  delete: HttpRouterFunctionPort;
  patch: HttpRouterFunctionPort;
  options: HttpRouterFunctionPort;
  all: HttpRouterFunctionPort;
}
