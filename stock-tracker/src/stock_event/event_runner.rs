use amiquip::{
  Connection, ConsumerMessage, ConsumerOptions, Exchange, Publish,
  QueueDeclareOptions, Result,
};
use log::{error, info};
use serde_json::from_str;
use retry::{retry, delay::Fixed};

use crate::configuration::CONFS;
use crate::stock_event::payload::EventPayloadTrackStock;
use crate::stock_event::TrackRequestHandler;

pub struct EventRunnerRabbitMQ<'b: 'a, 'a> {
  connection: Connection,
  track_req_handler: &'b mut TrackRequestHandler<'a>,
}

impl<'b, 'a> EventRunnerRabbitMQ<'b, 'a> {
  pub fn new(req_handler: &'b mut TrackRequestHandler<'a>) -> Self {
    let url = CONFS.message_queue.mq_url.as_str();

    Self {
      connection: EventRunnerRabbitMQ::try_connect(url),
      track_req_handler: req_handler,
    }
  }

  fn try_connect(url: &str) -> Connection {
    retry(Fixed::from_millis(3000).take(5), || {
      let result = Connection::insecure_open(url);
      match result.is_ok() {
        true => { Ok(result.unwrap()) },
        _ => { Err("connect failed") }
      }
    }).unwrap()
  }

  pub async fn process_event(&mut self) {
    info!("process_event] starts");
    let queue_name = CONFS.message_queue.track_request_queue.as_str();
    let channel = self
      .connection
      .open_channel(None)
      .expect("open_channel failed");
    let queue = channel
      .queue_declare(queue_name, QueueDeclareOptions::default())
      .expect("queue_declare failed");

    info!("process_event] waiting for messages");
    let consumer = queue
      .consume(ConsumerOptions::default())
      .expect("consume failed");
    for message in consumer.receiver().iter() {
      match message {
        ConsumerMessage::Delivery(delivery) => {
          self.handle_message(&delivery.body).await;
          consumer.ack(delivery).expect("consumer.ack error");
        }
        _ => {
          error!("invalid message");
        }
      }
    }
  }

  async fn handle_message(&mut self, payload: &Vec<u8>) {
    let raw_string = String::from_utf8_lossy(payload);
    let deserialized: EventPayloadTrackStock = from_str(&raw_string).unwrap();

    let result = self.track_req_handler.handle_request(deserialized).await;
    if result.is_err() {
      error!("handle_track_request error");
      return;
    }

    let to_string = serde_json::to_string(&result.unwrap()).unwrap();
    let _ = self.emit_event(to_string.as_str()).await;
  }

  async fn emit_event(&mut self, payload: &str) -> Result<()> {
    info!("emit_event");
    let emitter_queue_name = CONFS.message_queue.emitter_queue.as_str();

    let channel = self
      .connection
      .open_channel(None)
      .expect("open_channel failed");
    let exchange = Exchange::direct(&channel);

    exchange.publish(Publish::new(payload.as_bytes(), emitter_queue_name))?;

    Ok(())
  }
}
