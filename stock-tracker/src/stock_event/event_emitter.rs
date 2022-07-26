use amiquip::{ Connection, Result, Exchange, Publish};
use log::info;

use crate::configuration::load_configuration;

pub async fn emit_event(
  // TODO: add payload parameter
) -> Result<()> {
  info!("emit_event");
  let conf = load_configuration().expect("failed to load conf");
  let mq_url = conf.message_queue.mq_url.as_str();
  let emitter_queue_name = conf.message_queue.emitter_queue.as_str();

  let mut connection = Connection::insecure_open(mq_url)?;
  let channel = connection.open_channel(None).expect("open_channel failed");
  let exchange = Exchange::direct(&channel);
  
  exchange.publish(Publish::new("test".as_bytes(), emitter_queue_name))?;

  connection.close()
}