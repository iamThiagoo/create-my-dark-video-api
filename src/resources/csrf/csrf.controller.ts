import { Controller, Post, Req, Res } from '@nestjs/common';
import { doubleCsrf } from 'csrf-csrf';
import { Response } from 'express';

@Controller('csrf')
export class CsrfController {
  constructor() {}

  @Post()
  getCsrfToken(@Req() req, @Res() res: Response) {
    const { generateToken } = doubleCsrf({
      getSecret: () => process.env.CSRF_SECRET,
    });
    const csrfToken = generateToken(req, res, true, true);
    res.cookie('token', csrfToken, {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      signed: true,
      sameSite: 'strict'
    });
    res.json({ csrfToken });
  }
}
