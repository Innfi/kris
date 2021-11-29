import 'reflect-metadata';
import { Service } from 'typedi';
import axios from 'axios';
import dotenv from 'dotenv';
import AdapterWeb from './adapter.web';

dotenv.config();

const referenceUrl = process.env.URL;
const apiKey = process.env.API_KEY;

@Service()
class StatRepository {
  constructor(
    private adapterWeb: AdapterWeb, 
  ) {}
  
  //loadIntraday
  async loadIntraday(code: string, interval: string): Promise<any> {

  }

  //getDaily
  async getDaily(code: string): Promise<any> {
    
  }
}

export default StatRepository;
