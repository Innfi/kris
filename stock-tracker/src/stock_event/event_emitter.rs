use amiquip::{Connection, Exchange, Publish, Result};
use log::info;

use crate::configuration::StockTrackerConfs;

pub async fn emit_event(payload: &str) -> Result<()> {
  info!("emit_event");
  let stock_tracker_confs = StockTrackerConfs::new();
  let confs = stock_tracker_confs.get_conf();
  let mq_url = confs.message_queue.mq_url.as_str();
  let emitter_queue_name = confs.message_queue.emitter_queue.as_str();

  let mut connection = Connection::insecure_open(mq_url)?;
  let channel = connection.open_channel(None).expect("open_channel failed");
  let exchange = Exchange::direct(&channel);

  exchange.publish(Publish::new(payload.as_bytes(), emitter_queue_name))?;

  connection.close()
}
