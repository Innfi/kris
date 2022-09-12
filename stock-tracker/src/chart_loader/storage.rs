use log::info;
use redis::{self, Commands};

use crate::configuration::CONFS;

pub struct ChartStorageRedis {
  client: redis::Client,
}

impl ChartStorageRedis {
  pub fn new() -> Self {
    info!("ChartStorageRedis::new] ");
    let url = CONFS.database.redis_url.as_str();

    Self {
      client: redis::Client::open(url).expect("connect redis error"),
    }
  }

  pub fn save_chart_data(
    &self,
    key: &str,
    chart_data: &str,
    lifetime_as_sec: usize,
  ) -> Result<(), &'static str> {
    info!("ChartStorageRedis::save_chart_data] ");

    let mut conn: redis::Connection = self
      .client
      .get_connection()
      .expect("failed to get connection");

    let _: () = conn
      .set_ex(key, chart_data, lifetime_as_sec)
      .expect("set failed");

    Ok(())
  }

  pub fn exists(&self, key: &str) -> Result<bool, &'static str> {
    info!("ChartStorageRedis::exists] ");

    let mut conn: redis::Connection = self
      .client
      .get_connection()
      .expect("failed to get connection");

    let result: bool = conn.exists(key).expect("conn.exists error");

    Ok(result)
  }
}
