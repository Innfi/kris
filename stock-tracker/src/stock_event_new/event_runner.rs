use amiquip::{Queue, Channel, QueueDeclareOptions, ConsumerOptions, 
  ConsumerMessage, Connection, Result};
use log::{error, info};

pub struct EventRunner<'a> {
  connection: Connection,
  channel: Option<Channel>,
  queue: Option<Queue<'a>>,
}

impl<'a> EventRunner<'a> {
  pub fn new(url: &str) -> Self {
    Self {
      connection: Connection::insecure_open(url).expect("connection failed"),
      channel: None,
      queue: None,
    }
  }

  pub fn init_channel(&'a mut self, queue_name: &str) {
    self.channel = Some(self.connection.open_channel(None).expect("open_channel failed"));
    self.queue = Some(self.channel.as_ref().unwrap().queue_declare(queue_name, QueueDeclareOptions::default())
    .expect("queue_declare failed"));
  }

  // pub fn new(channel: &'a Channel, queue_name: &str) -> Self {
  //   Self {
  //     queue: channel.queue_declare(queue_name, QueueDeclareOptions::default())
  //       .expect("queue declare failed"),
  //   }
  // }

  pub async fn listen(&'a mut self) -> Result<()> {    
    info!("EventRunner.listen] ");
    let queue: &Queue = self.queue.as_ref().unwrap();

    let consumer = queue.consume(ConsumerOptions::default())?;
    for message in consumer.receiver().iter() {
      match message {
        ConsumerMessage::Delivery(delivery) => {
          info!("message delivered");
          consumer.ack(delivery)?;
        }
        _ => {
          error!("invalid message");
        }
      }
    }

    Ok(())
  }

  
}