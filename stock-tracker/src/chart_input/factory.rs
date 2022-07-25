use crate::chart_input::{
  InputDaily, InputIntraday, InputMonthly, InputWeekly, LoadChartInputTrait,
};

pub fn create_input(
  chart_type: String,
  symbol: String,
  interval: String,
) -> Box<dyn LoadChartInputTrait> {
  match chart_type.as_str() {
    "intraday" => Box::new(InputIntraday::new(symbol, interval)),
    "daily" => Box::new(InputDaily::new(symbol)),
    "weekly" => Box::new(InputWeekly::new(symbol)),
    "monthly" => Box::new(InputMonthly::new(symbol)),
    _ => Box::new(InputDaily::new(symbol)), // temporary
  }
}
