use bincode;
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string};
// use std::fs;

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

// #[test]
// fn variable_keyname() {
//   let raw_data = fs::read_to_string("sample/input.json").expect("read failed");

//   let v: Value = serde_json::from_str(&raw_data.as_str()).unwrap();
//   let target_field = &v["Time Series (Daily)"]["2022-07-13"]["1. open"];

//   assert_eq!(target_field.as_str().unwrap(), "34.9500");

//   let target_object = v["Time Series (Daily)"].as_object().unwrap();
//   target_object.keys().into_iter().for_each(|x: &String| {
//     println!("key data: {}", x);
//   });
// }
