import 'reflect-metadata';
import { Request, Response } from 'express';
import { Container, Service } from 'typedi';
import { useContainer, Get, Req, Res, Param, QueryParam, JsonController, 
} from 'routing-controllers';

useContainer(Container);

@Service()
@JsonController('/stat')
export class StatController {
  @Get('/:code')
  async getStats(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('code') code: string,
    @QueryParam('day') time: string, 
    @QueryParam('interval') interval: string,
  ) {
    console.log(`code: ${code}`);
    console.log(`time: ${time}`);
    console.log(`interval: ${interval}`);

    return res.status(200).send({ err: 'ok' });
  }
}
