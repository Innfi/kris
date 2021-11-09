import { Service } from 'typedi';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const referenceUrl = process.env.URL;
const apiKey = process.env.API_KEY;

export interface StatRepositoryBase {
  loadIntraday(code: string): Promise<any>;
  loadDaily(code: string): Promise<any>;
}

@Service()
export class StatRepository implements StatRepositoryBase {
  async loadIntraday(code: string): Promise<any> {
    const response = await axios.get(this.toUrl('TIME_SERIES_DAILY', code));
    return response.data;
  }

  async loadDaily(code: String): Promise<any> {

  }

  protected toUrl(type: string, code: string): string {
    return `${referenceUrl}${type}&symbol=${code}&interval=5min&apikey=${apiKey}`;
  }
}
