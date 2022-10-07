import Container, { Service } from 'typedi';

import { ChartRepositoryBase } from 'persistence/repository.base';
import { TradyLogger } from './common/logger';
import { ChartRequestInput, LoadChartDataResult } from './model/model';
import { ChartRepository } from './persistence/repository';
import { EventPayloadTrackStockRequest } from './message-queue/model';
import { MessageQueueBase } from './message-queue/queue.base';
import { MessageQueueRabbit } from './message-queue/queue.rabbit';

const toChartKey = (input: Readonly<ChartRequestInput>): string => {
  const { chartType, symbol, interval } = input;

  if (!interval) return `${chartType}.${symbol}.${interval}`;

  return `${chartType}.${symbol}`;
};

const toEventPayloadTrackStockRequest = (
  input: Readonly<ChartRequestInput>,
): Readonly<EventPayloadTrackStockRequest> => {
  const { chartType, symbol, interval } = input;

  return {
    chart_type: chartType,
    symbol,
    interval: interval as string,
  };
};

const createService = (): ChartService =>
  new ChartService(
    Container.get(ChartRepository),
    Container.get(MessageQueueRabbit),
    Container.get(TradyLogger),
  );

@Service({ factory: createService })
export class ChartService {
  constructor(
    protected repo: ChartRepositoryBase,
    protected mqService: MessageQueueBase,
    protected logger: TradyLogger,
  ) {}

  // loadChart
  async loadChart(
    reqInput: Readonly<ChartRequestInput>,
  ): Promise<Readonly<LoadChartDataResult>> {
    try {
      const key = toChartKey(reqInput);
      this.logger.info(`ChartService.loadChart] ${key}`);

      const loadResult = await this.repo.loadChartData(key);
      if (loadResult.err === 'ok') {
        this.logger.info(`ChartService.loadChart] ${key}: data from cache`);
        return loadResult;
      }

      this.logger.info(`ChartService.loadChart] ${key}: sending track request`);
      const sendResult = await this.mqService.sendTrackRequest(
        toEventPayloadTrackStockRequest(reqInput),
      );

      if (sendResult.err !== 'ok') return { err: sendResult.err };

      return {
        err: 'fetch requested',
      };
    } catch (err: unknown) {
      this.logger.error(`StatService.loadChart] ${(err as Error).stack}`);
      return { err: 'server error' };
    }
  }
}
