use amiquip::{
  Connection, ConsumerMessage, ConsumerOptions, Error, Exchange, Publish,
  QueueDeclareOptions, Result,
};
use log::{error, info};
use serde_json::from_str;

use crate::stock_event::handler_track_req;
use crate::stock_event::payload::EventPayloadTrackStock;

pub struct EventRunnerRabbitMQ {
  connection: Connection,
}

impl EventRunnerRabbitMQ {
  pub fn new(url: &str) -> Self {
    Self {
      connection: Connection::insecure_open(url).expect("insecure_open failed"),
    }
  }

  pub async fn process_event(
    &mut self,
    queue_name: &str,
    emitter_queue_name: &str,
  ) -> Result<(), Error> {
    let channel = self
      .connection
      .open_channel(None)
      .expect("open_channel failed");
    let queue = channel
      .queue_declare(queue_name, QueueDeclareOptions::default())
      .expect("queue_declare failed");

    info!("start_event_listener] waiting for messages");
    let consumer = queue
      .consume(ConsumerOptions::default())
      .expect("consume failed");
    for message in consumer.receiver().iter() {
      match message {
        ConsumerMessage::Delivery(delivery) => {
          self
            .handle_message(&delivery.body, emitter_queue_name)
            .await;
          consumer.ack(delivery)?;
        }
        _ => {
          error!("invalid message");
        }
      }
    }

    Ok(())
  }

  async fn handle_message(
    &mut self,
    payload: &Vec<u8>,
    emitter_queue_name: &str,
  ) {
    let raw_string = String::from_utf8_lossy(payload);
    let deserialized: EventPayloadTrackStock = from_str(&raw_string).unwrap();

    let result = handler_track_req::handle_track_request(deserialized).await;
    if result.is_err() {
      error!("handle_track_request error");
      return;
    }

    let to_string = serde_json::to_string(&result.unwrap()).unwrap();
    let _ = self
      .emit_event(to_string.as_str(), emitter_queue_name)
      .await;
  }

  async fn emit_event(
    &mut self,
    payload: &str,
    emitter_queue_name: &str,
  ) -> Result<()> {
    info!("emit_event");

    let channel = self
      .connection
      .open_channel(None)
      .expect("open_channel failed");
    let exchange = Exchange::direct(&channel);

    exchange.publish(Publish::new(payload.as_bytes(), emitter_queue_name))?;

    Ok(())
  }
}
