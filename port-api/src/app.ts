import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { Container, Service } from 'typedi';
import { useExpressServer, useContainer } from 'routing-controllers';

import { TradyLogger } from './common/logger';
import { EventQueue } from './event/types';
import { EventQueueRabbit } from './event/eventQueueRabbit';
import { PortController } from './controller';
import { PortService } from './service';

useContainer(Container);

const appInitializer = () =>
  new App(Container.get(EventQueueRabbit), Container.get(TradyLogger));

@Service({ factory: appInitializer })
export class App {
  app: any;

  constructor(protected eventQueue: EventQueue, protected logger: TradyLogger) {
    this.logger.info(`App.constructor] `);
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
    const port = process.env.PORT;
    this.app.listen(port, () => {
      this.logger.info(`App] listening ${port}`);
    });
  }

  protected initEventQueue() {
    this.logger.info(`App.initEventQueue] `);
    const portService = Container.get(PortService);

    this.eventQueue.registerListener(portService);
    this.eventQueue.run();
  }
}
