import express, { Request, Response } from 'express';
import { Container, Service } from 'typedi';
import { useExpressServer, useContainer } from 'routing-controllers';
import dotenv from 'dotenv';

import { EventQueueRabbit } from 'event/eventQueueRabbit';
import { TradyLogger } from './common/logger';
import { EventQueue } from './event/types';
import { PortController } from './controller';
import { PortService } from './service';

useContainer(Container);

dotenv.config();

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
    const port = process.env.PORT;
    this.app.listen(port, () => {
      this.logger.info(`App] listening ${port}`);
    });
  }

  protected initEventQueue() {
    this.logger.info(`App.initEventQueue] `);
    // FIXME: handle dependecies
    const eventQueue: EventQueue = Container.get(EventQueueRabbit);
    const portService = Container.get(PortService);

    eventQueue.registerListener(portService);
    eventQueue.run();
  }
}
