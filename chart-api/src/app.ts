import express, { Request, Response } from 'express';
import { Container, Service } from 'typedi';
import { useExpressServer, useContainer } from 'routing-controllers';
import dotenv from 'dotenv';

import { TradyLogger } from './common/logger';
import { ChartController } from './controller';

useContainer(Container);

dotenv.config();

const port = process.env.PORT ? process.env.PORT : 1330;

@Service()
export class App {
  app: any;

  constructor(protected tradyLogger: TradyLogger) {
    this.app = express();

    useExpressServer(this.app, {
      cors: true,
      controllers: [ChartController],
    });

    this.handleTest();
  }

  protected handleTest() {
    this.tradyLogger.info(`App.handleTest] `);
    this.app.get('/', (_req: Request, res: Response) => {
      res.status(200).send({ err: 'ok' }).end();
    });
  }

  start() {
    this.app.listen(port, () => {
      this.tradyLogger.info(`listening ${port}`);
    });
  }
}
