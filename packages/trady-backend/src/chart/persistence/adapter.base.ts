import {
  ReadStockDataInput,
  ReadStockDataResult,
  WriteStockDataInput,
  WriteStockDataResult,
} from 'chart/model';

interface AdapterBase {
  readStockData(
    input: Readonly<ReadStockDataInput>,
  ): Promise<Readonly<ReadStockDataResult>>;
  writeStockData(
    input: Readonly<WriteStockDataInput>,
  ): Promise<Readonly<WriteStockDataResult>>;
}

export default AdapterBase;
