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
  protected dbUrl = 'mongodb://localhost/users'; // FIXME

  protected options: ConnectOptions = {
    dbName: 'trady',
    autoCreate: true,
  };

  // connect
  connect() {
    mongoose.connect(this.dbUrl, this.options, () => {
      console.log('AdapterMongo] connected');
    });
  }

  async readUserPort(email: string): Promise<LoadPortfolioResult> {
    try {
      const portModel = mongoose.model<IPortfolio>(
        'portfolio',
        PortfolioSchema,
      );

      const findResult: IPortfolio | null = await portModel.findOne({
        email,
      });
    } catch (err: any) {
      // TODO: logging
      return {
        err: 'read mongo failed',
      };
    }

    return { err: 'ok' };
  }

  // writeUserPort
  writeUserPort(email: string, symbols: string[]): SavePortfolioResult {
    try {
    } catch (err: any) {
      return {
        err: 'write mongo failed',
      };
    }

    return { err: 'ok' };
  }
}

export default AdapterMongo;
