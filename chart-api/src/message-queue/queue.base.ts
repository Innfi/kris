import { EventPayloadTrackStockRequest, SendEventResult } from './model';

export interface MessageQueueBase {
  sendTrackRequest(
    payload: Readonly<EventPayloadTrackStockRequest>,
  ): Promise<SendEventResult>;
}
