use redis::{self, Commands};

pub fn test_function() {
  let client = redis::Client::open("redis://localhost:6379")
    .expect("failed to connect redis server");
  let mut con: redis::Connection = client.get_connection()
    .expect("failed to get connection");

  let _: () = con.set("test", "innfi").expect("set failed");
}