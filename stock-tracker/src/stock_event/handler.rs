use log::{error, info};

use crate::chart_loader::{
  get_chart, parse_chart_json, ChartStorageRedis, Creator, InputDaily,
  LoadChartInputTrait,
};
use crate::stock_event::payload::EventPayload;

pub async fn handle_track_request(
  payload: EventPayload,
) -> Result<(), &'static str> {
  //TODO: refer track scheduler for duplicate request

  //FIXME: daily for temporary timestamp type
  let input = InputDaily::new(payload.symbol);
  let get_chart_result = get_chart(&input).await;

  if get_chart_result.is_err() {
    error!("get_chart failed");
    return Err("get_chart failed");
  }
  let raw_data = get_chart_result.unwrap();

  let parse_result = parse_chart_json(input.to_timeseries_key(), raw_data);
  if parse_result.is_err() {
    return Err("parse_chart_json failed");
  }
  let chart_data = parse_result.unwrap();

  info!("saving chart data");

  //FIXME: need a central referece for redis client
  let redis_storage = ChartStorageRedis::new("redis://localhost:6379");
  let lifetime_as_sec: usize = 60 * 60 * 24;
  let _: () = redis_storage.save_chart_data(
    input.to_descriptor().as_str(),
    chart_data.as_str(),
    lifetime_as_sec,
  ).unwrap();

  Ok(())
}
