export type PayloadType = 'registerPort' | 'clearPort';

export interface EventPayload {
  payloadType: PayloadType;

  // FIXME: coupling
  email: string;
  symbols: string[];
}

export interface EventListener {
  handleEvent(payload: Readonly<EventPayload>): Promise<void>;
}

export interface EventQueue {
  // topics param for listener?
  registerListener(listener: EventListener): void;
  run(): void;
}
