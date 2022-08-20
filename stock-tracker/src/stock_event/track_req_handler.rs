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

    // create input
    let create_result = create_input(&payload);
    if create_result.is_err() {
      return Err("create input failed");
    }
    let input: Box<dyn LoadChartInputTrait> = create_result.unwrap();

    // check data exists
    if self.client.exists(input.to_descriptor().as_str()).unwrap() {
      return Ok(EventPayloadTrackStockResponse {
        chart_type: payload.chart_type,
        symbol: payload.symbol,
        err_message: String::from("key exists"),
      });
    }

    let get_chart_result = self.get_chart(&input).await;
    if get_chart_result.is_err() {
      return Err("parse_chart_json failed");
    }
    let chart_data = get_chart_result.unwrap();

    // save data to the database
    let _ = self.client.save_chart_data(
      input.to_descriptor().as_str(),
      chart_data.as_str(),
      input.to_lifetime_as_seconds(),
    );

    // return with success response
    Ok(EventPayloadTrackStockResponse {
      chart_type: payload.chart_type,
      symbol: payload.symbol,
      err_message: String::from("ok"),
    })
  }

  async fn get_chart(
    &mut self,
    input: &Box<dyn LoadChartInputTrait>,
  ) -> Result<String, &str> {
    // fetch raw data from reference
    let get_chart_result = get_chart(input.as_ref()).await;
    if get_chart_result.is_err() {
      error!("get_chart failed");
      return Err("get_chart failed");
    }
    let raw_data = get_chart_result.unwrap();

    // parse data to usable format
    parse_chart_json(input.to_timeseries_key(), raw_data)
  }
}
