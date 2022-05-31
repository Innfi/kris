import { Container, Service } from 'typedi';
import amqp from 'amqplib/callback_api';

import { TradyLogger } from '../common/logger';
import { EventListener, EventPayload, EventQueue } from './types';

const mqUrl = process.env.MQ_URL ? process.env.MQ_URL : 'amqp://localhost';

const createEventQueue = () =>
  new EventQueueRabbit(mqUrl, Container.get(TradyLogger));

@Service({ factory: createEventQueue })
export class EventQueueRabbit implements EventQueue {
  listeners: EventListener[] = [];

  readonly url: string;

  readonly queueName: string = 'port_queue'; // FIXME: multiple queue?

  constructor(url: string, protected logger: TradyLogger) {
    this.url = url;
  }

  // registerListener implements EventQueue method
  registerListener(listener: EventListener) {
    this.listeners.push(listener); // FIXME: duplicate listener?
  }

  // run implements EventQueue method
  run() {
    this.logger.info(`EventQueueRabbit.run] `);
    amqp.connect(this.url, (connectErr: any, connection: amqp.Connection) => {
      if (connectErr) {
        this.logger.error(
          `EventQueueRabbit.run] ${(connectErr as Error).stack}`,
        );
        throw connectErr;
      }

      this.logger.info(`EventQueueRabbit] connected`);

      connection.createChannel((createErr: any, channel: amqp.Channel) => {
        if (createErr) {
          this.logger.error(
            `EventQueueRabbit.run] ${(createErr as Error).stack}`,
          );
          throw createErr;
        }

        channel.assertQueue(this.queueName);

        channel.consume(this.queueName, async (msg: amqp.Message | null) => {
          try {
            const rawMessage = msg?.content.toString();
            if (!rawMessage) return;

            const payload = JSON.parse(rawMessage) as EventPayload;
            // TODO: handling parse error

            const promises: Promise<any>[] = this.listeners.map(
              async (listener: EventListener) => listener.handleEvent(payload),
            );

            await Promise.all(promises);
            this.logger.info(`consume finished`);
            // this.listeners.forEach((listener: EventListener) => {
            //   listener.handleEvent(payload);
            // });
          } catch (err) {
            this.logger.error(`consume] ${(err as Error).stack}`);
          }
        });
      });
    });
  }
}
