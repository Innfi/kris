import { LoadChartDataResult } from '../model/model';

export interface ChartRepositoryBase {
  loadChartData(key: string): Promise<Readonly<LoadChartDataResult>>;
}
