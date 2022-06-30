use amiquip::{
  Connection, 
  ConsumerMessage, 
  ConsumerOptions, 
  QueueDeclareOptions, 
  Result
};
use log::{error, info};

pub fn handle_message(payload: &Vec<u8>) {
  //todo: create factory by payload type
  info!("payload: {}", payload);
}


pub fn start_event_listener() -> Result<()> {
  let mut connection = Connection::insecure_open("amqp://127.0.0.1:5672")?;
  let channel = connection.open_channel(None).expect(open_channel failed);
  let queue = channel.queue_declare(
    "trady_stock_register",
    QueueDeclareOptions::default()
  ).expect("queue_declare failed");

  let consumer = queue.consume(ConsumerOptions::default())?;

  for (message) in consumer.receiver().iter() {
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