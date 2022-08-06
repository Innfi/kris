use amiquip::{Connection, Channel, Result, Error, Queue, QueueDeclareOptions, ConsumerOptions, ConsumerMessage};
use log::{error, info};
use serde_json::from_str;

use super::{EventPayloadTrackStock, handler_track_req};

pub struct EventRunner<'a> {
  connection: Connection,
  channel: Result<Channel, Error>,
  queue: Result<Queue<'a>, Error>,
}

impl<'a> EventRunner<'a> {
  pub fn new(url: &str) -> Self {
    info!("EventRunner.new] ");
    Self { 
      connection: Connection::insecure_open(url).expect("connection error"),
      channel: Err(Error::ClientClosedChannel),
      queue: Err(Error::ClientClosedChannel),
    }
  }

  pub fn init_channel(&'a mut self, queue_name: &str) {
    info!("EventRunner.init_channel] ");
    if self.channel.is_ok() {
      return;
    }

    self.channel = self.connection.open_channel(None);
    self.queue = self.channel.as_ref::<'a>().unwrap().queue_declare(queue_name,
      QueueDeclareOptions::default());
  }

  pub async fn try_consume(&mut self) {
    info!("EventRunner.try_consume] ");
    if !self.queue.is_ok() {
      error!("invalid queue");
    }
    let consumer = self.queue.as_ref().unwrap()
      .consume(ConsumerOptions::default()).expect("consume failed");
    for message in consumer.receiver().iter() {
      match message {
        ConsumerMessage::Delivery(delivery) => {
          self.handle_message(&delivery.body).await;
        }
        _ => {
          error!("invalid message")
        }
      }
    }

    // TODO: self.connectin.close()
  }

  async fn handle_message(&mut self, payload: &Vec<u8>) {
    info!("EventRunner.handle_message] ");
    let raw_string = String::from_utf8_lossy(payload);
    let deserialized: EventPayloadTrackStock = from_str(&raw_string).unwrap();

    let _ = handler_track_req::handle_track_request(deserialized).await;
  }
}

