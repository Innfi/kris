import { Request, Response } from 'express';
import { Service } from 'typedi';
import {
  Get,
  Req,
  Res,
  Param,
  QueryParam,
  JsonController,
} from 'routing-controllers';

import { ReadStockDataResult } from './model';
import StatService from './service';

@Service()
@JsonController('/stat')
class StatController {
  constructor(protected service: StatService) {}

  @Get('/intraday/:symbol')
  async getIntradayStats(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('symbol') symbol: string,
    @QueryParam('interval') interval: string,
  ): Promise<Response> {
    const result: ReadStockDataResult = await this.service.loadIntraday(
      symbol,
      interval,
    );

    return res.status(200).send(result);
  }

  // @Get('/byport/intraday/:email')
  // async getIntradayStatsByPort(
  //   @Req() _req: Request,
  //     @Res() res: Response,
  //     @Param('email') email: string,
  // ): Promise<Response> {
  //   const result: LoadPortfolioStatsResult = await this.service
  //     .loadIntradayByPort(email);

  //   return res.status(200).send(result);
  // }

  // @Get('/daily/:code')
  // async getDailyStats(
  // @Req() _req: Request,
  //   @Res() res: Response,
  //   @Param('code') code: string,
  // ) {
  //   const data = await this.repo.loadDaily(code);

  //   return res.status(200).send({ err: 'ok', data });
  // }
}

export default StatController;
