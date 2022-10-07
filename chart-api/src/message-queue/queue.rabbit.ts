import { Service } from 'typedi';
import amqplib from 'amqplib';
import dotenv from 'dotenv';

import { TradyLogger } from '../common/logger';
import { EventPayloadTrackStockRequest, SendEventResult } from './model';
import { MessageQueueBase } from './queue.base';

dotenv.config();

const mqUrl = process.env.MQ_URL ? process.env.MQ_URL : 'amqp://127.0.0.1:5672';
const trackRequestQueueName = process.env.TRACK_REQ_NAME
  ? process.env.TRACK_REQ_NAME
  : 'trady_stock_register';
// const emitterQueueName = process.env.EMITTER_NAME
//   ? process.env.EMITTER_NAME
//   : 'trady_tracker_event';

@Service()
export class MessageQueueRabbit implements MessageQueueBase {
  constructor(protected logger: TradyLogger) {
    this.logger.info(`RabbitMQService] `);
  }

  async sendTrackRequest(
    payload: Readonly<EventPayloadTrackStockRequest>,
  ): Promise<SendEventResult> {
    try {
      this.logger.info(`MessageQueueRabbit.sendTrackRequest] `);
      // TODO: retry logic as rabbitmq server takes time to run
      const conn = await amqplib.connect(mqUrl);

      const channel = await conn.createChannel();

      const sendResult = channel.sendToQueue(
        trackRequestQueueName,
        Buffer.from(JSON.stringify(payload)),
      );

      if (sendResult) return { err: 'ok' };

      return { err: 'send event failed' };
    } catch (err: unknown) {
      this.logger.error(
        `MessageQueueRabbit.sendTrackRequest] ${(err as Error).stack}`,
      );
      return { err: 'server error' };
    }
  }
}
