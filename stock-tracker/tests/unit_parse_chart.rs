use core::panic;
use std::fs;
use std::collections::HashMap;

#[test]
fn load_file() {
  let raw_data = fs::read_to_string("sample/input.json").expect("read failed");

  assert_eq!(raw_data.len() > 0, true);
}

#[test]
fn json_parse() {
  let raw_data = fs::read_to_string("sample/input.json").expect("read failed");

  let result = json::parse(&raw_data.as_str());
  if result.is_err() {
    panic!("parse failed");
  }

  let unwrapped = result.unwrap();
  assert_eq!(unwrapped["Time Series (Daily)"].is_object(), true);

  unwrapped["Time Series (Daily)"].entries()
    .for_each(|x: (&str, &json::JsonValue)| {
    println!("key: {}", x.0);
    println!("open value: {}", x.1["1. open"]);
  });

  let target_field = &unwrapped["Time Series (Daily)"]["2022-07-13"]["1. open"];
  assert_eq!(target_field.as_str().unwrap(), "34.9500");
}

#[test]
fn json_object_dump() {
  let mut scores = HashMap::new();

  scores.insert(3, "test");
  scores.insert(2, "this");
  scores.insert(1, "collection");

  let keys = scores.keys().collect::<Vec<&i32>>();
  assert_eq!(keys.len(), 3);
}