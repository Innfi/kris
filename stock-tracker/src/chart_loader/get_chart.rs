use reqwest::{self, Error};

use crate::chart_input::LoadChartInputTrait;
use crate::configuration::StockTrackerConfs;

pub async fn get_chart(
  input: &dyn LoadChartInputTrait,
) -> Result<String, Error> {
  let stock_tracker_confs = StockTrackerConfs::new();
  let confs = stock_tracker_confs.get_conf();
  let effective_url = input.to_query_string(
    confs.chart_reference.url.as_str(),
    confs.chart_reference.api_key.as_str(),
  );

  Ok(reqwest::get(effective_url).await?.text().await?)
}
