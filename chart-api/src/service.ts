import { Service } from 'typedi';

import { TradyLogger } from './common/logger';
import { ChartRequestInput, LoadChartDataResult } from './model';
import { LoadChartInputBase } from './chart-input/input.base';
import { toLoadChartInput } from './chart-input/factory';
import { ChartRepository } from './repository';
import { MessageQueueService } from './message-queue/service';
import { toEventPayloadTrackStockRequest } from './util';

@Service()
export class ChartService {
  constructor(
    protected repo: ChartRepository,
    protected mqService: MessageQueueService,
    protected logger: TradyLogger,
  ) {}

  // loadChart
  async loadChart(
    reqInput: Readonly<ChartRequestInput>,
  ): Promise<Readonly<LoadChartDataResult>> {
    try {
      const input: LoadChartInputBase = toLoadChartInput(reqInput);

      const loadResult = await this.repo.loadChartData(input);
      if (loadResult.err === 'ok') return loadResult;

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
