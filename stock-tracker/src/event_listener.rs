use amiquip::{Connection, ConsumerMessage, ConsumerOptions, QueueDeclareOptions, Result};
use log::{error, info};

pub fn start_event_listener() -> Result<()> {
  info!("start_event_listener");
  println!("start_event_listener");
  let mut connection = Connection::insecure_open(
    "amqp://127.0.0.1:5672"
  )?;
  let channel = connection.open_channel(None)
    .expect("open_channel failed");
  let queue = channel.queue_declare(
    "trady_stock_register",
    QueueDeclareOptions::default()
    ).expect("queue_declare failed");

  let consumer = queue.consume(ConsumerOptions::default())?;
  println!("waiting for messages");
  for message in consumer.receiver().iter() {
    match message {
      ConsumerMessage::Delivery(delivery) => {
        handle_message(&delivery.body);
        consumer.ack(delivery)?;
      },
      _ => {
        error!("invalid message");
      }
    }
  }

  connection.close()
}

pub fn handle_message(payload: &Vec<u8>) {
  println!("handle_message");
  let body = String::from_utf8_lossy(payload);
  // info!("payload: {}", body);
  println!("body: {}", body);
}
