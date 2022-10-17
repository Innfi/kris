use elasticsearch::{
  Error,
  Elasticsearch,
  http::transport::Transport,
  IndexParts,
};
use serde_json::json;
use serde::{Serialize, Deserialize};
use chrono::prelude::*;

pub struct Logger {
  client: Elasticsearch,
}

#[derive(Serialize, Deserialize)]
pub struct LogPayload<'a> {
  pub msg: &'a str,
}

impl<'a> Logger<'a> {
  pub fn new(url: &str) -> Self {
    Self {
      client: Elasticsearch::new(Transport::single_node(url).unwrap())
    }
  }
  pub async fn info(&self, payload: LogPayload<'a>) -> Result<(), Error> {
    self.client.index(IndexParts::IndexId("replace_this", "1"))
      .body(json!(payload))
      .send()
      .await?;

    Ok(())
  }
}