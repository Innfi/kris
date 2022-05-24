export type PayloadType = 'registerPort' | 'clearPort';

export interface EventPayload {
	payloadType: PayloadType;

	//FIXME: coupling
	email: string;
	ports: string[];
}

export interface EventListener {
	handleEvent(payload: Readonly<EventPayload>): void;
}

export interface EventQueue {
	//topics param for listener?
	registerListener(listener: EventListener): void;
	run(): void;
}