import 'reflect-metadata';
import { Request, Response } from 'express';
import { Container, Service } from 'typedi';
import {
  useContainer, Get, Req, Res, Param, QueryParam, JsonController,
} from 'routing-controllers';

import { StatRepository } from './repository';

useContainer(Container);

@Service()
@JsonController('/stat')
export class StatController {
  constructor(
    protected repo: StatRepository,
  ) {}

  @Get('/:code')
  async getStats(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('code') code: string,
    @QueryParam('type') type: string,
  ) {
    console.log(`code: ${code}`);
    console.log(`type: ${type}`);

    const data = await this.repo.loadIntraday(code);

    return res.status(200).send({ err: 'ok', data });
  }
}
