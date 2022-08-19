use log::info;
use redis::{self, Commands};

pub struct ChartStorageRedis {
  client: redis::Client,
}

impl ChartStorageRedis {
  pub fn new(url: &str) -> Self {
    info!("ChartStorageRedis::new] ");
    Self {
      client: redis::Client::open(url).expect("connect redis error"),
    }
  }

  pub fn save_chart_data(
    &self,
    desc: &str,
    chart_data: &str,
    lifetime_as_sec: usize,
  ) -> Result<(), &'static str> {
    info!("ChartStorageRedis::save_chart_data] ");

    let mut conn: redis::Connection = self
      .client
      .get_connection()
      .expect("failed to get connection");

    let _: () = conn
      .set_ex(desc, chart_data, lifetime_as_sec)
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
