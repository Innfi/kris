import express, { Request, Response } from 'express';
import { Container, Service } from 'typedi';
import { useExpressServer, useContainer } from 'routing-controllers';
import dotenv from 'dotenv';

import { TradyLogger } from './common/logger';
import { EventQueue } from './event/types';
import { EventQueueRabbit } from './event/eventQueueRabbit';
import { PortController } from './controller';
import { PortService } from './service';

useContainer(Container);

dotenv.config();

const port = process.env.PORT ? process.env.PORT : 3000;

const appInitializer = () =>
  new App(Container.get(EventQueueRabbit), Container.get(TradyLogger));

@Service({ factory: appInitializer })
export class App {
  app: any;

  constructor(protected eventQueue: EventQueue, protected logger: TradyLogger) {
    this.app = express();

    useExpressServer(this.app, {
      cors: true,
      controllers: [PortController],
    });

    this.handleTest();
    this.initEventQueue();
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

  protected initEventQueue() {
    this.logger.info(`initEventQueue] `);
    const portService = Container.get(PortService);

    this.eventQueue.registerListener(portService);
    this.eventQueue.run();
  }
}
