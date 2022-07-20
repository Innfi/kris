use json;

pub struct TimeSeriesUnit {
  pub date: String,
  pub chart_value: Vec<String>,
}

pub fn parse_chart(
  timeseries_key: String,
  raw_data: String
) -> Vec<TimeSeriesUnit> {
  let name_open = "1.open";
  let name_high = "2. high";
  let name_low = "3. low";
  let name_close = "4. close";

  let parsed = json::parse(&raw_data.as_str()).expect("parse error");
  let chart_data = &parsed[timeseries_key.as_str()];

  chart_data.entries().map(|x: (&str, &json::JsonValue)| {
    let mut chart_vec: Vec<String> = Vec::new();
    chart_vec.push(x.1[name_open].as_str().unwrap().into());
    chart_vec.push(x.1[name_high].as_str().unwrap().into());
    chart_vec.push(x.1[name_low].as_str().unwrap().into());
    chart_vec.push(x.1[name_close].as_str().unwrap().into());

    TimeSeriesUnit {
      date: x.0.into(),
      chart_value: chart_vec.clone(),
    }
  }).collect()
}