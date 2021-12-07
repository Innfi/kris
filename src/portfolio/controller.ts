import { Request, Response } from 'express';
import { Service } from 'typedi';
import {
  Req, Res, Post, JsonController, Body,
} from 'routing-controllers';

interface AddPortfolioInput {
  code: string;
}

@Service()
@JsonController('/port')
class PortController {
  // constructor() {}

  @Post('/add')
  async addPortfolio(
    @Req() _req: Request,
      @Res() res: Response,
      @Body() _body: AddPortfolioInput,
  ): Promise<Response> {
    return res.status(200).send({ err: 'ok' });
  }
}

export default PortController;
