use crate::chart_input::{
  InputDaily, InputIntraday, InputMonthly, InputWeekly, LoadChartInputTrait,
};

pub fn create_input(
  chart_type: String,
  symbol: String,
  interval: String,
) -> Result<Box<dyn LoadChartInputTrait>, &'static str> {
  match chart_type.as_str() {
    "intraday" => Ok(Box::new(InputIntraday::new(symbol, interval))),
    "daily" => Ok(Box::new(InputDaily::new(symbol))),
    "weekly" => Ok(Box::new(InputWeekly::new(symbol))),
    "monthly" => Ok(Box::new(InputMonthly::new(symbol))),
    _ => Err("invalid chart type"),
  }
}
