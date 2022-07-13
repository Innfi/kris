use reqwest::{self, Error};

use crate::chart_loader::LoadChartInputTrait;
use crate::configuration::load_configuration;

pub async fn get_chart(
  input: &impl LoadChartInputTrait,
) -> Result<String, Error> {
  let confs = load_configuration().expect("failed to load conf");
  let effective_url = input
    .to_query_string(confs.chart_reference.url, confs.chart_reference.api_key);

  Ok(reqwest::get(effective_url).await?.text().await?)
}
