import { Service } from 'typedi';
import amqp from 'amqplib/callback_api';

import { TradyLogger } from '../logger';
import { EventListener, EventQueue } from "./types";

@Service()
export class EventQueueRabbit implements EventQueue {
	listeners: EventListener[] = [];
	readonly url: string;
	readonly queueName: string = 'port_queue'; //FIXME: multiple queue?

	constructor(url: string, protected logger: TradyLogger) {
		this.url = url;
	}

	// registerListener implements EventQueue method
	registerListener(listener: EventListener) {
		this.listeners.push(listener); //FIXME: duplicate listener?
	}

	// run implements EventQueue method
	run() {
		amqp.connect(this.url, (connectErr: any, connection: amqp.Connection) => {
			if (connectErr) {
				this.logger.error(`EventQueueRabbit.run] ${(connectErr as Error).stack}`);
				throw connectErr;
			}

			this.logger.info(`EventQueueRabbit] connected`);

			connection.createChannel((createErr: any, channel: amqp.Channel) => {
				if (createErr) {
					this.logger.error(`EventQueueRabbit.run] ${(createErr as Error).stack}`);
					throw createErr;
				}

				channel.assertQueue('dummy');
			});
		});
	}
}