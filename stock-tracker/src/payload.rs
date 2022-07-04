use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct EventPayload {
  // todo: type value ?
  pub symbol: String,
  pub request_user: String,
}
