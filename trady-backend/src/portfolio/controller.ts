import { Request, Response } from 'express';
import { Service } from 'typedi';
import {
  Req,
  Res,
  Post,
  JsonController,
  Body,
  Get,
  Param,
} from 'routing-controllers';

import { LoadPortfolioResult, SavePortfolioResult } from './model';
import { PortService } from './service';

interface AddPortfolioInput {
  email: string;
  symbols: string[];
}

@Service()
@JsonController('/port')
export class PortController {
  constructor(private service: PortService) {}

  @Post('/add')
  async addPortfolio(
    @Req() _req: Request,
    @Res() res: Response,
    @Body() body: AddPortfolioInput,
  ): Promise<Response> {
    const result: SavePortfolioResult = await this.service.savePort(
      body.email,
      body.symbols,
    );

    if (result.err !== 'ok') return res.status(400).send({ err: result.err });

    return res.status(200).send({ err: 'ok' });
  }

  @Get('/list/:email')
  async listPortfolio(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('email') email: string, // TODO: need auth
  ): Promise<Response> {
    const result: LoadPortfolioResult = await this.service.listPort(email);

    if (result.err !== 'ok') return res.status(400).send({ err: result.err });

    return res.status(200).send({
      err: 'ok',
      symbols: result.symbols,
    });
  }
}
