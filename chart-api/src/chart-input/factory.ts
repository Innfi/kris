import { ChartRequestInput } from "../model";
import { LoadChartInputBase } from './input.base';
import { LoadChartInputIntraday } from "./input.intraday";
import { LoadChartInputDaily } from "./input.daily";
import { LoadChartInputWeekly } from "./input.weekly";
import { LoadChartInputMonthly } from "./input.monthly";

export const toLoadChartInput = (
  reqInput: Readonly<ChartRequestInput>,
): LoadChartInputBase => {
  const { chartType, symbol, interval } = reqInput;

  switch (chartType) {
    case 'intraday': return new LoadChartInputIntraday(symbol, interval as string);
    case 'daily': return new LoadChartInputDaily(symbol);
    case 'weekly': return new LoadChartInputWeekly(symbol);
    case 'monthly': return new LoadChartInputMonthly(symbol);
    default: throw new Error('invalid chart type');
  }
}