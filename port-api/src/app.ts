import express, { Request, Response } from 'express';
import { Container, Service } from 'typedi';
import { useExpressServer, useContainer } from 'routing-controllers';
import dotenv from 'dotenv';

import { TradyLogger } from './common/logger';
import { PortController } from './controller';

useContainer(Container);

dotenv.config();

const port = process.env.PORT ? process.env.PORT : 3000;

@Service()
export class App {
  app: any;

  constructor(protected logger: TradyLogger) {
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
    this.app.listen(port, () => {
      this.logger.info(`listening ${port}`);
    });
  }
}
