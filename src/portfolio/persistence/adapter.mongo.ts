import { Service } from 'typedi';
import mongoose, { ConnectOptions, Document, Schema } from 'mongoose';

import { LoadPortfolioResult, SavePortfolioResult } from '../model';

interface IPortfolio extends Document {
  email: string;
  symbols: string[];
}

const PortfolioSchema = new Schema<IPortfolio>({
  email: { type: String, index: true },
  symbols: { type: [String] },
});

@Service()
class AdapterMongo {
  protected dbUrl = 'mongodb://localhost/trady'; // FIXME

  protected options: ConnectOptions = {
    dbName: 'trady',
    autoCreate: true,
  };

  protected portModel = mongoose.model<IPortfolio>(
    'portfolio',
    PortfolioSchema,
  );

  // connect
  connect() {
    mongoose.connect(this.dbUrl, this.options, () => {
      console.log('AdapterMongo] connected');
    });
  }

  async readUserPort(email: string): Promise<LoadPortfolioResult> {
    try {
      if(mongoose.connection.readyState !== mongoose.STATES.connected) {
        this.connect();
      }

      const findResult: IPortfolio | null = await this.portModel.findOne({
        email,
      });

      return {
        err: 'ok',
        symbols: findResult?.symbols,
      };
    } catch (err: any) {
      // TODO: logging
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
      if(mongoose.connection.readyState !== mongoose.STATES.connected) {
        this.connect();
      }

      await this.portModel.create({
        email: email,
        symbols: symbols,
      });
    } catch (err: any) {
      return {
        err: 'write mongo failed',
      };
    }

    return { err: 'ok' };
  }
}

export default AdapterMongo;
