import express, { Request, Response } from 'express';
import { Container, Service } from 'typedi';
import { useExpressServer, useContainer } from 'routing-controllers';
import dotenv from 'dotenv';

import { TradyLogger } from './common/logger';
import { PortController } from './controller';

useContainer(Container);

dotenv.config();

@Service()
export class App {
  app: any;

  constructor(protected tradyLogger: TradyLogger) {
    this.app = express();

    useExpressServer(this.app, {
      cors: true,
      controllers: [PortController],
    });

    this.handleTest();
  }

  protected handleTest() {
    this.app.get('/', (_req: Request, res: Response) => {
      res.status(200).send({ err: 'ok', worker: 'port-service' }).end();
    });
  }

  start() {
    const port = process.env.PORT;
    this.app.listen(port, () => {
      this.tradyLogger.info(`Trady.stat] listening ${port}`);
    });
  }
}
