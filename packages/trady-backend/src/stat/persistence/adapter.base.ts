import {
  ReadStockDataInput,
  ReadStockDataResult,
  WriteStockDataInput,
  WriteStockDataResult,
} from 'stat/model';

interface AdapterBase {
  readStockData(input: ReadStockDataInput): Promise<ReadStockDataResult>;
  writeStockData(input: WriteStockDataInput): Promise<WriteStockDataResult>;
}

export default AdapterBase;
