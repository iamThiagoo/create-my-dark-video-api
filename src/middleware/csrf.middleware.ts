import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { doubleCsrf, DoubleCsrfConfigOptions } from 'csrf-csrf';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const doubleCsrfOptions: DoubleCsrfConfigOptions = {
      getSecret: () => process.env.CSRF_SECRET,
      cookieName: 'token',
      getTokenFromRequest: (req) => req.headers['x-csrf-token'] as string,
    };

    console.log(req.headers['x-csrf-token']);
    console.log(req.cookies.token);

    if (req.path === '/csrf') return next();
    if (req.headers['x-csrf-token'] === req.cookies.token) return next();

    const { doubleCsrfProtection } = doubleCsrf(doubleCsrfOptions);
    doubleCsrfProtection(req, res, next);
  }
}
