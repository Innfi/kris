import 'reflect-metadata';
import express from 'express';
import { Container, Service } from 'typedi';
import { useExpressServer, useContainer } from 'routing-controllers';

import StatController from './stat/controller';
import PortController from './portfolio/controller';

useContainer(Container);

/**
TODO
-------------------------------------------------------------------------------
- create a suitable topic name of data folders,
(for names will be applied to memory caches too)

DONE
-------------------------------------------------------------------------------
* retrieve stock data from web
* parsing data to more machine-friendly style
* save / retrieve stock data from file
* caching by file
* interface for portfolio lists

*/

@Service()
class Trady {
  app: any;

  constructor() {
    this.app = express();

    useExpressServer(this.app, {
      controllers: [
        StatController,
        PortController,
      ],
    });
  }

  start() {
    const port = process.env.npm_package_config_port;
    this.app.listen(port, () => {
      console.log(`Trady.stat] listening ${port}`);
    });
  }
}

export default Trady;
