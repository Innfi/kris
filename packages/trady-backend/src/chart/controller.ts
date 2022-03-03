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

import ChartService from './service';

@Service()
@JsonController('/chart')
class ChartController {
  constructor(protected service: ChartService) {}

  @Get('/intraday/:symbol')
  async getIntradayStats(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('symbol') symbol: string,
    @QueryParam('interval') interval: string,
  ): Promise<Response> {
    const result = await this.service.loadIntraday(symbol, interval);

    return res.status(200).send(result);
  }
}

export default ChartController;
