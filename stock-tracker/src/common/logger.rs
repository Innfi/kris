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

impl<'a> Logger {
  pub fn new(url: &str) -> Self {
    Self {
      client: Elasticsearch::new(Transport::single_node(url).unwrap())
    }
  }
  pub async fn info(&self, payload: LogPayload<'a>) -> Result<(), Error> {
    let index = self.to_date_index();

    self.client.index(IndexParts::Index(index.as_str()))
      .body(json!(payload))
      .send()
      .await?;

    Ok(())
  }

  fn to_date_index(&self) -> String {
    let utc = Utc::now();

    utc.format("logs-%Y.%m.%d").to_string()
  }
}