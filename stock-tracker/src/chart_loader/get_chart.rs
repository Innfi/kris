use reqwest::{self, Error};

use crate::chart_input::LoadChartInputTrait;
use crate::configuration::CONFS;

pub async fn get_chart(
  input: &dyn LoadChartInputTrait,
) -> Result<String, Error> {
  let effective_url = input.to_query_string(
    CONFS.chart_reference.url.as_str(),
    CONFS.chart_reference.api_key.as_str(),
  );

  Ok(reqwest::get(effective_url).await?.text().await?)
}
