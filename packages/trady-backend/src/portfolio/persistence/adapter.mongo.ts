import { Service } from 'typedi';
import mongoose, { ConnectOptions, Document, Schema } from 'mongoose';
import dotenv from 'dotenv';

import TradyLogger from '../../common/logger';
import { LoadPortfolioResult, SavePortfolioResult } from '../model';
import AdapterBase from './adapter.base';

dotenv.config();
const mongoUrl = process.env.MONGO_URL;

interface IPortfolio extends Document {
  email: string;
  symbols: string[];
}

const PortfolioSchema = new Schema<IPortfolio>({
  email: { type: String, index: true },
  symbols: { type: [String] },
});

@Service()
class AdapterMongo implements AdapterBase {
  protected dbUrl = `${mongoUrl}/trady`

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
    mongoose.connect(this.dbUrl, this.options, () => {
      this.logger.info('AdapterMongo] connected');
    });
  }

  async readUserPort(email: string): Promise<LoadPortfolioResult> {
    try {
      if (mongoose.connection.readyState !== mongoose.STATES.connected) {
        this.connect();
      }

      const findResult: IPortfolio | null = await this.portModel.findOne({
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
    } catch (err: unknown) {
      this.logger.error(`AdapterMongo.writeUserPort] ${(err as Error).stack}`);

      return {
        err: 'write mongo failed',
      };
    }

    return { err: 'ok' };
  }
}

export default AdapterMongo;
