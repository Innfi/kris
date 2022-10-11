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

import { TradyLogger } from './common/logger';
import {
  AddPortfolioInput,
  LoadPortfolioResult,
  SavePortfolioResult,
} from './model';
import { PortService } from './service';

@Service()
@JsonController('/port')
export class PortController {
  constructor(private service: PortService, protected logger: TradyLogger) {}

  @Post('/add')
  async addPortfolio(
    @Req() _req: Request,
    @Res() res: Response,
    @Body() body: AddPortfolioInput,
  ): Promise<Response> {
    const { email, symbols } = body;

    this.logger.info(
      `PortController.addPortfolio] ${email}: ${JSON.stringify(symbols)}`,
    );
    const result: SavePortfolioResult = await this.service.savePort(
      email,
      symbols,
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
    this.logger.info(`PortController.listPortfolio] ${email}`);
    const result: LoadPortfolioResult = await this.service.listPort(email);

    if (result.err !== 'ok') return res.status(400).send({ err: result.err });

    return res.status(200).send({
      err: 'ok',
      symbols: result.symbols,
    });
  }
}
