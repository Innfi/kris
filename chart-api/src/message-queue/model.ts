import { ChartError } from '../model';

export interface EventPayloadTrackStockRequest {
  chart_type: string;
  symbol: string;
  interval: string;
}

export interface SendEventResult {
  err: ChartError;
}
