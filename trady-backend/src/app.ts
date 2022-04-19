import express, { Request, Response } from 'express';
import { Container, Service } from 'typedi';
import { useExpressServer, useContainer } from 'routing-controllers';
import dotenv from 'dotenv';

import ChartController from './chart/controller';
import PortController from './portfolio/controller';
import TradyLogger from './common/logger';

useContainer(Container);

dotenv.config();

@Service()
class Trady {
  app: any;

  constructor(protected tradyLogger: TradyLogger) {
    this.app = express();

    useExpressServer(this.app, {
      cors: true,
      controllers: [ChartController, PortController],
    });

    this.handleTest();
  }

  protected handleTest() {
    this.app.get('/', (_req: Request, res: Response) => {
      res.status(200).send({ err: 'ok' }).end();
    });
  }

  start() {
    const port = process.env.PORT;
    this.app.listen(port, () => {
      this.tradyLogger.info(`Trady.stat] listening ${port}`);
    });
  }
}

export default Trady;
