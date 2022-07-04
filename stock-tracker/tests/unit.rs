use bincode;
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string};

#[derive(Serialize, Deserialize)]
struct Payload {
  symbol: String,
  request_user: String,
}

#[test]
fn serde_basic_behavior() {
  let payload = Payload {
    symbol: format!("TWTR"),
    request_user: format!("innfi"),
  };

  let serialized = to_string(&payload).unwrap();
  let deserialized: Payload = from_str(&serialized).unwrap();

  assert_eq!(deserialized.symbol, payload.symbol);
  assert_eq!(deserialized.request_user, payload.request_user);
}

#[test]
fn working_with_vec_u8() {
  let payload = Payload {
    symbol: format!("TWTR"),
    request_user: format!("innfi"),
  };

  let serialized = bincode::serialize(&payload).unwrap();
  let deserialized: Payload = bincode::deserialize(&serialized).unwrap();

  assert_eq!(deserialized.symbol, payload.symbol);
  assert_eq!(deserialized.request_user, payload.request_user);
}

#[test]
fn init_test() {
  assert_eq!(1, 1);
}
