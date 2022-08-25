use config::Config;
use lazy_static::lazy_static;
use std::env;

#[derive(serde::Deserialize)]
pub struct Settings {
  pub database: DatabaseSettings,
  pub message_queue: MessageQueueSettings,
  pub chart_reference: ChartReferenceSettings,
  pub healthcheck: HealthCheckSettings,
}

#[derive(serde::Deserialize)]
pub struct DatabaseSettings {
  pub redis_url: String,
}

#[derive(serde::Deserialize)]
pub struct MessageQueueSettings {
  pub mq_url: String,
  pub track_request_queue: String,
  pub emitter_queue: String,
}

#[derive(serde::Deserialize)]
pub struct ChartReferenceSettings {
  pub url: String,
  pub api_key: String,
}

#[derive(serde::Deserialize)]
pub struct HealthCheckSettings {
  pub addr: String,
}

fn load_configuration() -> Result<Settings, config::ConfigError> {
  let base_path = std::env::current_dir().expect("failed to load current dir");
  let config_dir = base_path.join("configuration");
  let config = Config::builder()
    .add_source(config::File::from(config_dir.join("base")).required(true))
    .add_source(config::File::from(config_dir.join("ref")).required(true))
    .build()
    .unwrap();

  config.try_deserialize()
}

fn load_configuration_prod() -> Result<Settings, &'static str> {
  let result = Settings {
    database: DatabaseSettings {
      redis_url: env::var("REDIS_URL").unwrap(),
    },
    message_queue: MessageQueueSettings {
      mq_url: env::var("REDIS_URL").unwrap(),
      track_request_queue: env::var("REDIS_URL").unwrap(),
      emitter_queue: env::var("REDIS_URL").unwrap(),
    },
    chart_reference: ChartReferenceSettings {
      url: env::var("REDIS_URL").unwrap(),
      api_key: env::var("REDIS_URL").unwrap(),
    },
    healthcheck: HealthCheckSettings {
      addr: env::var("REDIS_URL").unwrap(),
    },
  };

  Ok(result)
}

lazy_static! {
  pub static ref CONFS: Settings =
    if env::var("MODE") == Ok(String::from("PROD")) {
      load_configuration_prod().unwrap()
    } else {
      load_configuration().unwrap()
    };
}
