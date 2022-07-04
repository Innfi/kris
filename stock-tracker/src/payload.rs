use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct EventPayload {
  // todo: type value ?
  symbol: String,
  request_user: String,
}
