use core::panic;
use std::fs;

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
  let target_field = &unwrapped["Time Series (Daily)"]["2022-07-13"]["1. open"];
  assert_eq!(target_field.as_str().unwrap(), "34.9500");
}