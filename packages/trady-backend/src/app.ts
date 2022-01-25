import express, { Request, Response } from 'express';
import { Container, Service } from 'typedi';
import { useExpressServer, useContainer } from 'routing-controllers';
import dotenv from 'dotenv';

import StatController from './chart/controller';
import PortController from './portfolio/controller';
import TradyLogger from 'common/logger';

useContainer(Container);

/**
TODO
-------------------------------------------------------------------------------
- create a suitable topic name of data folders,
(for names will be applied to memory caches too)
- logging support

DONE
-------------------------------------------------------------------------------
* retrieve stock data from web
* parsing data to more machine-friendly style
* save / retrieve stock data from file
* caching by file
* interface for portfolio lists

*/

dotenv.config();

@Service()
class Trady {
  app: any;

  constructor(
    protected tradyLogger: TradyLogger,
  ) {
    this.app = express();

    useExpressServer(this.app, {
      cors: true,
      controllers: [StatController, PortController],
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
      this.tradyLogger.logger.info(`Trady.stat] listening ${port}`);
    });
  }
}

export default Trady;
