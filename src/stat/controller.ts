import 'reflect-metadata';
import { Request, Response } from 'express';
import { Container, Service } from 'typedi';
import {
  useContainer, Get, Req, Res, Param, QueryParam, JsonController,
} from 'routing-controllers';

import StatRepository from './persistence/repository';


useContainer(Container);

@Service()
@JsonController('/stat')
class StatController {
  constructor(
    protected repo: StatRepository,
  ) {}

  @Get('/intraday/:code')
  async getIntradayStats(
  @Req() _req: Request,
    @Res() res: Response,
    @Param('code') code: string,
    @QueryParam('interval') interval: string,
  ) {
    const data = await this.repo.loadIntraday(code, interval);

    return res.status(200).send({ err: 'ok', data });
  }

  @Get('/daily/:code')
  async getDailyStats(
  @Req() _req: Request,
    @Res() res: Response,
    @Param('code') code: string,
  ) {
    const data = await this.repo.loadDaily(code);

    return res.status(200).send({ err: 'ok', data });
  }
}

export default StatController;
