import 'reflect-metadata';
import { Container } from 'typedi';
import assert from 'assert';

import { TradyLogger } from '../src/common/logger';
import { ChartService } from '../src/service';
import { ChartError, LoadChartDataResult } from '../src/model/model';
import { ChartRepositoryBase } from '../src/persistence/repository.base';
import { MessageQueueBase } from '../src/message-queue/queue.base';
import {
  EventPayloadTrackStockRequest,
  SendEventResult,
} from '../src/message-queue/model';

class MockRepo implements ChartRepositoryBase {
  result: any;

  async loadChartData(key: string): Promise<Readonly<LoadChartDataResult>> {
    return this.result;
  }
}

class MockMQ implements MessageQueueBase {
  err: ChartError = 'ok';

  async sendTrackRequest(
    payload: Readonly<EventPayloadTrackStockRequest>,
  ): Promise<SendEventResult> {
    return { err: this.err };
  }
}

describe('ChartService', () => {
  it('returns chart data if read from repository succeeds', async () => {
    // arrange
    const repoInstance = new MockRepo();
    const mqInstance = new MockMQ();
    const service = new ChartService(
      repoInstance,
      mqInstance,
      Container.get(TradyLogger),
    );
    repoInstance.result = {
      err: 'ok',
      chartData: [
        {
          descriptor: 'intraday.TWTR.30min',
          timeSeries: [{ x: new Date(), y: [1.0, 2.0, 3.0, 4.0] }],
        },
      ],
    };

    // action
    const result = await service.loadChart({
      chartType: 'intraday',
      symbol: 'TWTR',
      interval: '30min',
    });

    // assert
    assert.strictEqual(result.err, 'ok');
    assert.strictEqual(
      JSON.stringify(result.chartData),
      JSON.stringify(repoInstance.result.chartData),
    );
  });

  it('returns -fetch requested- if fetch signal is necessary', async () => {
    // arrange
    const repoInstance = new MockRepo();
    const mqInstance = new MockMQ();
    const service = new ChartService(
      repoInstance,
      mqInstance,
      Container.get(TradyLogger),
    );
    repoInstance.result = { err: 'not exist' };
    mqInstance.err = 'ok';

    // action
    const result = await service.loadChart({
      chartType: 'intraday',
      symbol: 'TWTR',
      interval: '30min',
    });

    // assert
    assert.strictEqual(result.err, 'fetch requested');
  });

  it('returns -send event failed- for queue client error', async () => {
    // arrange
    const repoInstance = new MockRepo();
    const mqInstance = new MockMQ();
    const service = new ChartService(
      repoInstance,
      mqInstance,
      Container.get(TradyLogger),
    );
    repoInstance.result = { err: 'not exist' };
    mqInstance.err = 'send event failed';

    // action
    const result = await service.loadChart({
      chartType: 'intraday',
      symbol: 'TWTR',
      interval: '30min',
    });

    // assert
    assert.strictEqual(result.err, 'send event failed');
  });
});
