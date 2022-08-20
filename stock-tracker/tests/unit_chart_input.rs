#[cfg(test)]
mod unit_chart_input_intraday {
  use stock_tracker::chart_input::{InputIntraday, LoadChartInputTrait};

  #[test]
  fn intraday_descriptor() {
    let instance =
      InputIntraday::new(String::from("TWTR"), String::from("60min"));
    let expected = String::from("TWTR.TIME_SERIES_INTRADAY.60min");

    let descriptor = instance.to_descriptor();

    assert_eq!(descriptor, expected);
  }

  #[test]
  fn intraday_query_string() {
    let instance =
      InputIntraday::new(String::from("TWTR"), String::from("60min"));
    let expected = String::from(
			"prefix?function=TIME_SERIES_INTRADAY&symbol=TWTR&interval=60min&apikey=testkey"
		);

    let query_string = instance.to_query_string("prefix", "testkey");

    assert_eq!(query_string, expected);
  }

	#[test]
	fn intraday_timeseries_key() {
		let instance =
      InputIntraday::new(String::from("TWTR"), String::from("30min"));
		let expected = String::from("Time Series (30min)");

		let timeseries_key = instance.to_timeseries_key();

		assert_eq!(timeseries_key, expected);
	}
}

#[cfg(test)]
mod unit_chart_input_daily {
	use stock_tracker::chart_input::{InputDaily, LoadChartInputTrait};
	
	#[test]
	fn daily_descriptor() {
		let instance = InputDaily::new(String::from("CARA"));
		let expected = String::from("CARA.TIME_SERIES_DAILY");

		let descriptor = instance.to_descriptor();

		assert_eq!(descriptor, expected);
	}

	#[test]
	fn daily_query_string() {
		let instance = InputDaily::new(String::from("CARA"));
		let expected = String::from(
			"pre?function=TIME_SERIES_DAILY&symbol=CARA&apikey=testkey"
		);

		let query_string = instance.to_query_string("pre", "testkey");

		assert_eq!(query_string, expected);
	}

	#[test]
	fn daily_timeseries_day() {
		let instance = InputDaily::new(String::from("CARA"));
		let expected = String::from("Time Series (Daily)");

		let timeseries_key = instance.to_timeseries_key();

		assert_eq!(timeseries_key, expected);
	}
}

#[cfg(test)]
mod unit_chart_input_weekly {
	use stock_tracker::chart_input::{InputWeekly, LoadChartInputTrait};

	#[test]
	fn weekly_descriptor() {
		let instance = InputWeekly::new(String::from("GME"));
		let expected = String::from("GME.TIME_SERIES_WEEKLY");

		let descriptor = instance.to_descriptor();

		assert_eq!(descriptor, expected);
	}

	#[test]
	fn weekly_query_string() {
		let instance = InputWeekly::new(String::from("GME"));
		let expected = String::from(
			"pre?function=TIME_SERIES_WEEKLY&symbol=GME&apikey=key"
		);

		let query_string = instance.to_query_string("pre", "key");

		assert_eq!(query_string, expected);
	}

	#[test]
	fn weekly_timeseries_key() {
		let instance = InputWeekly::new(String::from("GME"));
		let expected = String::from("Weekly Time Series");

		let timeseries_key = instance.to_timeseries_key();

		assert_eq!(timeseries_key, expected);
	}
}

#[cfg(test)]
mod unit_chart_input_monthly {
	use stock_tracker::chart_input::{InputMonthly, LoadChartInputTrait};

	#[test]
	fn monthly_descriptor() {
		let instance = InputMonthly::new(String::from("RBLX"));
		let expected = String::from("RBLX.TIME_SERIES_MONTHLY");

		let descriptor = instance.to_descriptor();

		assert_eq!(descriptor, expected);
	}

	#[test]
	fn monthly_query_string() {
		let instance = InputMonthly::new(String::from("RBLX"));
		let expected = String::from(
			"pre?function=TIME_SERIES_MONTHLY&symbol=RBLX&apikey=key"
		);

		let query_string = instance.to_query_string("pre", "key");

		assert_eq!(query_string, expected);
	}

	#[test]
	fn monthly_timeseries_key() {
		let instance = InputMonthly::new(String::from("RBLX"));
		let expected = String::from("Monthly Time Series");

		let timeseries_key = instance.to_timeseries_key();

		assert_eq!(timeseries_key, expected);
	}
}

#[cfg(test)]
mod unit_input_factory {
	use stock_tracker::chart_input::{create_input, LoadChartInputTrait};
	#[test]
	fn create_intraday() {
		let chart_input: Box<dyn LoadChartInputTrait> = create_input(
			String::from("intraday"),
			String::from("TWTR"),
			String::from("30min")
		);
		let expected = String::from("TWTR.TIME_SERIES_INTRADAY.30min");
		
		let descriptor = chart_input.to_descriptor();

		assert_eq!(descriptor, expected);
	}

	#[test]
	fn other_types_dont_care_interval() {
		let chart_input: Box<dyn LoadChartInputTrait> = create_input(
			String::from("daily"),
			String::from("TWTR"),
			String::from("30min")
		);
		let expected = String::from("TWTR.TIME_SERIES_DAILY");

		let descriptor = chart_input.to_descriptor();

		assert_eq!(descriptor, expected);
	}
}