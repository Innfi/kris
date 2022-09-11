import { EventPayloadTrackStockRequest } from 'message-queue/model';
import { ChartRequestInput } from 'model';

export const toEventPayloadTrackStockRequest = (
  input: Readonly<ChartRequestInput>,
): Readonly<EventPayloadTrackStockRequest> => {
  const { chartType, symbol, interval } = input;
  return {
    chart_type: chartType,
    symbol,
    interval: interval as string,
  };
};
