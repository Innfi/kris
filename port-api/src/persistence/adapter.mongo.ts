import { Service } from 'typedi';
import mongoose, { ConnectOptions, Document, Schema } from 'mongoose';

import { TradyLogger } from '../common/logger';
import {
  ClearPortfolioResult,
  LoadPortfolioResult,
  SavePortfolioResult,
} from '../model';
import { AdapterBase } from './adapter.base';

const mongoUrl = process.env.MONGO_URL
  ? process.env.MONGO_URL
  : 'mongodb://localhost:27017/trady';

interface IPortfolio extends Document {
  email: string;
  symbols: string[];
}

const PortfolioSchema = new Schema<IPortfolio>({
  email: { type: String, index: true },
  symbols: { type: [String] },
});

@Service()
export class AdapterMongo implements AdapterBase {
  protected dbUrl = `${mongoUrl}/trady`;

  protected options: ConnectOptions = {
    dbName: 'trady',
    autoCreate: true,
  };

  protected portModel = mongoose.model<IPortfolio>(
    'portfolio',
    PortfolioSchema,
  );

  constructor(protected logger: TradyLogger) {}

  // connect
  connect() {
    this.logger.info(`AdapterMongo.connect]`);
    mongoose.connect(this.dbUrl, this.options, () => {
      this.logger.info('AdapterMongo] connected');
    });
  }

  // readUserPort
  async readUserPort(email: string): Promise<LoadPortfolioResult> {
    try {
      if (mongoose.connection.readyState !== mongoose.STATES.connected) {
        this.connect();
      }

      const findResult = await this.portModel.findOne({
        email,
      });

      return {
        err: 'ok',
        symbols: findResult?.symbols,
      };
    } catch (err: unknown) {
      this.logger.error(`AdapterMongo.readUserPort] ${(err as Error).stack}`);

      return {
        err: 'read mongo failed',
      };
    }
  }

  // writeUserPort
  async writeUserPort(
    email: string,
    symbols: string[],
  ): Promise<SavePortfolioResult> {
    try {
      if (mongoose.connection.readyState !== mongoose.STATES.connected) {
        this.connect();
      }

      await this.portModel.create({
        email,
        symbols,
      });

      return { err: 'ok' };
    } catch (err: unknown) {
      this.logger.error(`AdapterMongo.writeUserPort] ${(err as Error).stack}`);

      return {
        err: 'write failed',
      };
    }
  }

  // clearUserPort
  async clearUserPort(email: string): Promise<ClearPortfolioResult> {
    try {
      if (mongoose.connection.readyState !== mongoose.STATES.connected) {
        this.connect();
      }

      await this.portModel.deleteOne({
        email,
      });

      return { err: 'ok' };
    } catch (err: unknown) {
      this.logger.error(`AdapterMongo.clearUserPort] ${(err as Error).stack}`);

      return {
        err: 'clear failed',
      };
    }
  }
}
