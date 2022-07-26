use amiquip::{
  Connection, ConsumerMessage, ConsumerOptions, QueueDeclareOptions, Result,
};
use log::{error, info};
use serde_json::from_str;

use crate::configuration::load_configuration;
use crate::stock_event::handler_track_req;
use crate::stock_event::payload::EventPayloadTrackStock;

pub async fn start_event_listener() -> Result<()> {
  info!("start_event_listener");
  let conf = load_configuration().expect("failed to load conf");
  let mq_url = conf.message_queue.mq_url;
  let track_queue_name = conf.message_queue.track_request_queue.as_str();

  let mut connection = Connection::insecure_open(mq_url.as_str())?;
  let channel = connection.open_channel(None).expect("open_channel failed");
  let queue = channel
    .queue_declare(track_queue_name, QueueDeclareOptions::default())
    .expect("queue_declare failed");

  info!("start_event_listener] waiting for messages");
  let consumer = queue.consume(ConsumerOptions::default())?;
  for message in consumer.receiver().iter() {
    match message {
      ConsumerMessage::Delivery(delivery) => {
        handle_message(&delivery.body).await;
        consumer.ack(delivery)?;
      }
      _ => {
        error!("invalid message");
      }
    }
  }

  connection.close()
}

async fn handle_message(payload: &Vec<u8>) {
  let raw_string = String::from_utf8_lossy(payload);
  let deserialized: EventPayloadTrackStock = from_str(&raw_string).unwrap();

  let result = handler_track_req::handle_track_request(deserialized).await;

  match result {
    Ok(()) => {}
    Err(e) => {
      error!("handle_message: {}", e)
    }
  }
}
