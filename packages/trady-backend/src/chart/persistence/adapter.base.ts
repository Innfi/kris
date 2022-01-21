import {
  ReadStockDataInput,
  ReadStockDataResult,
  WriteStockDataInput,
  WriteStockDataResult,
} from 'chart/model';

interface AdapterBase {
  readStockData(input: ReadStockDataInput): Promise<ReadStockDataResult>;
  writeStockData(input: WriteStockDataInput): Promise<WriteStockDataResult>;
}

export default AdapterBase;
