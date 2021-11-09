import 'reflect-metadata';
import express from 'express';
import { Service } from 'typedi';
import { useExpressServer } from 'routing-controllers';

import { StatController } from 'stat/controller';

@Service()
export class Trady {
  app: any;

  constructor() {
    this.app = express();

    useExpressServer(this.app, {
      controllers: [
        StatController,
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
