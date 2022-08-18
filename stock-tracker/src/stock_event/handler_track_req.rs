use log::{error, info};

use crate::configuration::StockTrackerConfs;
use crate::chart_input::create_input;
use crate::chart_loader::{get_chart, parse_chart_json, ChartStorageRedis};
use crate::stock_event::payload::EventPayloadTrackStock;
use crate::stock_event::EventPayloadTrackStockResponse;

pub async fn handle_track_request(
  payload: EventPayloadTrackStock,
) -> Result<EventPayloadTrackStockResponse, &'static str> {
  //TODO: refer track scheduler for duplicate request
  let input = create_input(
    payload.chart_type.clone(),
    payload.symbol.clone(),
    payload.interval,
  );
  let get_chart_result = get_chart(input.as_ref()).await;

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
  save_chart_data_to_redis(
    input.to_descriptor().as_str(),
    chart_data.as_str(),
    input.to_lifetime_as_seconds(),
  );

  Ok(EventPayloadTrackStockResponse {
    chart_type: payload.chart_type,
    symbol: payload.symbol,
    err_message: String::from("ok"),
  })
}

fn save_chart_data_to_redis(desc: &str, data: &str, lifetime: usize) {
  let stock_tracker_confs = StockTrackerConfs::new();
  let confs = stock_tracker_confs.get_conf();
  let redis_url = format!("{}", confs.database.redis_url);

  let redis_storage = ChartStorageRedis::new(redis_url.as_str());
  let _: () = redis_storage.save_chart_data(desc, data, lifetime).unwrap();
}
