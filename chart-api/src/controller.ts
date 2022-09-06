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

import { ChartService } from './service';

@Service()
@JsonController('/chart')
export class ChartController {
  constructor(protected service: ChartService) {}

  @Get('/intraday/:symbol')
  async getIntradayChart(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('symbol') symbol: string,
    @QueryParam('interval') interval: string,
  ): Promise<Response> {
    const result = await this.service.loadIntraday(symbol, interval);

    return res.status(200).send(result);
  }

  @Get('/daily/:symbol')
  async getDailyChart(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('symbol') symbol: string,
  ): Promise<Response> {
    const result = await this.service.loadDaily(symbol);

    return res.status(200).send(result);
  }

  @Get('/weekly/:symbol')
  async getWeeklyChart(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('symbol') symbol: string,
  ): Promise<Response> {
    const result = await this.service.loadWeekly(symbol);

    return res.status(200).send(result);
  }

  @Get('/monthly/:symbol')
  async getMonthlyChart(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('symbol') symbol: string,
  ): Promise<Response> {
    const result = await this.service.loadMonthly(symbol);

    return res.status(200).send(result);
  }
}
