import { HttpCodes } from '@@const';

export class CoreError extends Error {
  constructor(
    public message: string,
    public code: HttpCodes,
  ) {
    super(message);
    this.name = 'CoreError';
  }

  static from(message: string, code: HttpCodes): CoreError {
    return new CoreError(message, code);
  }

  static fakeSuccess(
    message: string,
    code: HttpCodes = HttpCodes.OK,
  ): CoreError {
    return new CoreError(message, code);
  }

  static notFound(message: string): CoreError {
    return new CoreError(message, HttpCodes.NOT_FOUND);
  }

  static badRequest(message: string): CoreError {
    return new CoreError(message, HttpCodes.BAD_REQUEST);
  }

  static unauthorized(message: string): CoreError {
    return new CoreError(message, HttpCodes.UNAUTHORIZED);
  }

  static forbidden(message: string): CoreError {
    return new CoreError(message, HttpCodes.FORBIDDEN);
  }

  static internalServerError(message: string): CoreError {
    return new CoreError(message, HttpCodes.INTERNAL_SERVER_ERROR);
  }

  static conflict(message: string): CoreError {
    return new CoreError(message, HttpCodes.CONFLICT);
  }
}
