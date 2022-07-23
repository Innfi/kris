use redis::{self, Commands};
pub struct ChartStorageRedis {
  client: redis::Client,
}

impl ChartStorageRedis {
  pub fn new(url: &str) -> Self {
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
    let mut conn: redis::Connection = self
      .client
      .get_connection()
      .expect("failed to get connection");

    println!("desc: {}", desc);
    println!("chart data len: {}", chart_data.len());

    let _: () = conn
      .set_ex(desc, chart_data, lifetime_as_sec)
      .expect("set failed");

    Ok(())
  }
}
