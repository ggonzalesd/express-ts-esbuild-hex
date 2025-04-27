import { HttpErrorCallback } from '@@app/ports/HttpService.port';
import { CoreError } from '@@core/errors';

export const errorHandlerFactory = (): HttpErrorCallback => {
  return (err, req, res) => {
    // Handler CoreError
    if (err instanceof CoreError) {
      const { code, message } = err;
      res.status(code).json({ ok: false, message });
      return;
    }

    // Handler other errors
    if (err instanceof Error) {
      res.status(500).json({ ok: false, message: err.message });
      return;
    }

    // Handler string errors
    if (typeof err === 'string') {
      res.status(500).json({ ok: false, message: err });
      return;
    }

    // Handler unknown errors
    res.status(500).json({ error: 'Internal Server Error' });
  };
};
