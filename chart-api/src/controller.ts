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

import { TradyLogger } from './common/logger';
import { ChartService } from './service';

@Service()
@JsonController('/chart')
export class ChartController {
  constructor(protected service: ChartService, protected logger: TradyLogger) {}

  @Get('/intraday/:symbol')
  async getIntradayChart(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('symbol') symbol: string,
    @QueryParam('interval') interval: string,
  ): Promise<Response> {
    this.logger.info(`ChartController.getIntradayChart] ${symbol}:${interval}`);
    const result = await this.service.loadChart({
      chartType: 'intraday',
      symbol,
      interval,
    });

    return res.status(200).send(result);
  }

  @Get('/daily/:symbol')
  async getDailyChart(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('symbol') symbol: string,
  ): Promise<Response> {
    this.logger.info(`ChartController.getDailyChart] ${symbol}`);
    const result = await this.service.loadChart({
      chartType: 'daily',
      symbol,
    });

    return res.status(200).send(result);
  }

  @Get('/weekly/:symbol')
  async getWeeklyChart(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('symbol') symbol: string,
  ): Promise<Response> {
    this.logger.info(`ChartController.getDailyChart] ${symbol}`);
    const result = await this.service.loadChart({
      chartType: 'weekly',
      symbol,
    });

    return res.status(200).send(result);
  }

  @Get('/monthly/:symbol')
  async getMonthlyChart(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('symbol') symbol: string,
  ): Promise<Response> {
    this.logger.info(`ChartController.getMonthlyChart] ${symbol}`);
    const result = await this.service.loadChart({
      chartType: 'monthly',
      symbol,
    });

    return res.status(200).send(result);
  }
}
