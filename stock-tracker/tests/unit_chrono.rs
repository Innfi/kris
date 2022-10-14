use chrono::prelude::*;

#[test]
fn test_chrono_ymd() {
  let test_date = chrono::Utc.ymd(2022, 10, 14);

  assert_eq!(test_date.to_string().as_str(), "2022-10-14UTC");
}

#[test]
fn test_chrono_format() {
  let test_date = chrono::Utc.ymd(2022, 10, 14);

  assert_eq!(
    test_date.format("logs-%Y.%m.%d").to_string().as_str(),
    "logs-2022.10.14"
  );
}