use crate::{
  chart_input::{
    InputDaily, InputIntraday, InputMonthly, InputWeekly, LoadChartInputTrait,
  },
  stock_event::EventPayloadTrackStock,
};

pub fn create_input(
  payload: &EventPayloadTrackStock,
) -> Result<Box<dyn LoadChartInputTrait>, &'static str> {
  let symbol = payload.symbol.clone();
  let interval = payload.interval.clone();
  let chart_type = payload.chart_type.as_str();

  match chart_type {
    "intraday" => Ok(Box::new(InputIntraday::new(symbol, interval))),
    "daily" => Ok(Box::new(InputDaily::new(symbol))),
    "weekly" => Ok(Box::new(InputWeekly::new(symbol))),
    "monthly" => Ok(Box::new(InputMonthly::new(symbol))),
    _ => Err("invalid chart type"),
  }
}
