import { type createServer } from 'http';

export const HttpMethods = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'OPTIONS',
  'ALL',
  'USE',
] as const;

export interface HttpCookieOptions {
  maxAge?: number;
  signed?: boolean;
  expires?: Date;
  httpOnly?: boolean;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
}

export interface HttpRequest {
  path: string;
  method: string;
  params: Record<string, string | undefined>;
  query: Record<string, string | null | undefined>;
  headers: Record<string, string | undefined>;
  cookies: Record<string, string | undefined>;
  getBody: () => unknown;
  getUser: () => unknown;
  setUser: (user: unknown) => void;
}

export interface HttpResponse {
  status: (statusCode: number) => this;
  json: (data: unknown) => void;
  send: (data: unknown) => void;
  redirect: (url: string) => void;
  setHeader: (name: string, value: string) => void;
  setCookie: (name: string, value: string, options?: HttpCookieOptions) => void;
}

export type HttpNext = (err?: unknown) => void;

export type HttpEndPoint =
  | `${(typeof HttpMethods)[number]} ${string}`
  | (typeof HttpMethods)[number];

export type HttpCallback = (
  req: HttpRequest,
  res: HttpResponse,
  next: HttpNext,
) => void | Promise<void>;

export type HttpErrorCallback = (
  err: unknown,
  req: HttpRequest,
  res: HttpResponse,
  next: HttpNext,
) => void | Promise<void>;

export type HttpHandler<T = HttpCallback | HttpRouter> = (
  option?: HttpEndPoint,
  ...handlers: Array<T>
) => void;

export interface HttpRouter {
  handler: HttpHandler;
}

export interface HttpApplication extends HttpRouter {
  // listen: (port: number, callback?: () => void) => void;
  set: (name: string, value: unknown) => void;
  disable: (path: string) => void;
  enable: (path: string) => void;
  attach: (server: ReturnType<typeof createServer>) => void;
  error: (handler: HttpErrorCallback) => void;
}
