use amiquip::{
  Connection, ConsumerMessage, ConsumerOptions, QueueDeclareOptions, Result,
};
use serde_json::from_str;
use log::{error, info};

use crate::payload::EventPayload;
use crate::handler;

pub fn start_event_listener() -> Result<()> {
  info!("start_event_listener");
  let mut connection = Connection::insecure_open("amqp://127.0.0.1:5672")?;
  let channel = connection.open_channel(None).expect("open_channel failed");
  let queue = channel
    .queue_declare("trady_stock_register", QueueDeclareOptions::default())
    .expect("queue_declare failed");

  info!("start_event_listener] waiting for messages");
  let consumer = queue.consume(ConsumerOptions::default())?;
  for message in consumer.receiver().iter() {
    match message {
      ConsumerMessage::Delivery(delivery) => {
        handle_message(&delivery.body);
        consumer.ack(delivery)?;
      }
      _ => {
        error!("invalid message");
      }
    }
  }

  connection.close()
}

fn handle_message(payload: &Vec<u8>) {
  let raw_string = String::from_utf8_lossy(payload);
  let deserialized: EventPayload = from_str(&raw_string).unwrap();

  let result = handler::handle_track_request(deserialized);

  match result {
    Ok(()) => {},
    Err(e) => { error!("handle_message: {}", e) },
  }
}
