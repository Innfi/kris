use amiquip::{Connection, Channel, Result, Error, Queue, QueueDeclareOptions};
use log::{error, info};

pub struct EventRunner<'a> {
  connection: Connection,
  channel: Result<Channel, Error>,
  queue: Result<Queue<'a>, Error>,
}

impl<'a> EventRunner<'a> {
  pub fn new(url: &str) -> Self {
    Self { 
      connection: Connection::insecure_open(url).expect("connection error"),
      channel: Err(Error::ClientClosedChannel),
      queue: Err(Error::ClientClosedChannel),
    }
  }

  pub fn init_channel(&mut self, queue_name: &str) {
    if self.channel.is_ok() {
      return;
    }

    self.channel = self.connection.open_channel(None);
    self.queue = self.channel.as_ref().unwrap().queue_declare(queue_name,
      QueueDeclareOptions::default());
  }

  pub fn try_consume(&mut self) {

  }
}
