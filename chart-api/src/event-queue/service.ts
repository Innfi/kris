import { Service } from 'typedi';
import amqplib from 'amqplib';
import dotenv from 'dotenv';

import { TradyLogger } from '../common/logger';
import { EventPayloadTrackStockRequest, SendEventResult } from './model';

dotenv.config();

const mqUrl = process.env.MQ_URL ? process.env.MQ_URL : '127.0.0.1:5672';
const trackRequestQueueName = process.env.TRACK_REQ_NAME
  ? process.env.TRACK_REQ_NAME
  : 'trady_stock_register';
// const emitterQueueName = process.env.EMITTER_NAME
//   ? process.env.EMITTER_NAME
//   : 'trady_tracker_event';

@Service()
export class RabbitMQService {
  constructor(protected logger: TradyLogger) {
    this.logger.info(`RabbitMQService] `);
  }

  async sendTrackRequest(
    payload: Readonly<EventPayloadTrackStockRequest>,
  ): Promise<SendEventResult> {
    this.logger.info(`RabbitMQService.sendTrackRequest] `);
    // TODO: retry logic as rabbitmq server takes time to run
    const conn = await amqplib.connect(mqUrl);
    const channel = await conn.createChannel();

    const sendResult = channel.sendToQueue(
      trackRequestQueueName,
      Buffer.from(JSON.stringify(payload)),
    );

    if (sendResult) return { err: 'ok' };

    return { err: 'send event failed' };
  }
}
