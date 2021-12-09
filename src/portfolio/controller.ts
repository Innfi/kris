import { Request, Response } from 'express';
import { Service } from 'typedi';
import {
  Req, Res, Post, JsonController, Body, Get, QueryParam,
} from 'routing-controllers';

import { LoadPortfolioResult, SavePortfolioResult } from './model';
import PortRepository from './repository';

interface AddPortfolioInput {
  email: string;
  symbols: string[];
}

@Service()
@JsonController('/port')
class PortController {
  constructor(private repo: PortRepository) {}

  @Post('/add')
  async addPortfolio(
    @Req() _req: Request,
      @Res() res: Response,
      @Body() body: AddPortfolioInput,
  ): Promise<Response> {
    const result: SavePortfolioResult = await this.repo.savePortfolio(body.email, body.symbols);

    if (result.err !== 'ok') return res.status(400).send({ err: result.err });

    return res.status(200).send({ err: 'ok' });
  }

  @Get('/list')
  async listPortfolio(
    @Req() _req: Request,
      @Res() res: Response,
      @QueryParam('email') email: string,
  ): Promise<Response> {
    const result: LoadPortfolioResult = await this.repo.loadPortfolio(email);

    if (result.err !== 'ok') return res.status(400).send({ err: result.err });

    return res.status(200).send({
      err: 'ok',
      symbols: result.symbols,
    });
  }
}

export default PortController;
