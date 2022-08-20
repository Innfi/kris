use log::{error, info};

use crate::chart_input::{create_input, LoadChartInputTrait};
use crate::chart_loader::{get_chart, parse_chart_json, ChartStorageRedis};
use crate::stock_event::payload::EventPayloadTrackStock;
use crate::stock_event::EventPayloadTrackStockResponse;

pub struct TrackRequestHandler<'a> {
  client: &'a ChartStorageRedis,
}

impl<'a> TrackRequestHandler<'a> {
  pub fn new(redis_client: &'a ChartStorageRedis) -> Self {
    Self {
      client: redis_client,
    }
  }

  pub async fn handle_request(
    &mut self,
    payload: EventPayloadTrackStock,
  ) -> Result<EventPayloadTrackStockResponse, &'static str> {
    info!("TrackRequestHandler.handle_request] ");
    let create_result = create_input(
      payload.chart_type.clone(),
      payload.symbol.clone(),
      payload.interval,
    );
    if create_result.is_err() {
      return Err("create input failed");
    }

    let input: Box<dyn LoadChartInputTrait> = create_result.unwrap();

    if self.client.exists(input.to_descriptor().as_str()).unwrap() {
      return Ok(EventPayloadTrackStockResponse {
        chart_type: payload.chart_type,
        symbol: payload.symbol,
        err_message: String::from("key exists"),
      });
    }

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

    let _ = self.client.save_chart_data(
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
}
