import { Request, Response } from 'express';
import { Service } from 'typedi';
import { Body, JsonController, Post, Req, Res } from 'routing-controllers';

interface AuthData {
  email: string;
  passphrase: string;
}

@Service()
@JsonController()
export class AuthController {
  constructor() {} // TODO: domain controller

  @Post('/signup')
  async signup(
    @Req() _req: Request,
    @Res() res: Response,
    @Body() body: Readonly<AuthData>,
  ): Promise<Response> {
    //TODO: add user to database. invoke an event maybe?

    return res.status(500).send({ err: 'not implemented' });
  }

  @Post('/signin')
  async signin(@Req() req: Request, @Res() res: Response): Promise<Response> {
    return res.status(500).send({ err: 'not implemented' });
  }
}
