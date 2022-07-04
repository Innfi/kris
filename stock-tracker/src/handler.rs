use log::info;

use crate::payload::EventPayload;

pub fn handle_track_request(payload: EventPayload) -> Result<(), &'static str> {
  info!("symbol: {}, invoke user: {}", payload.symbol, payload.request_user);

  Ok(())
}