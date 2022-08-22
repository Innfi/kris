use config::Config;
use lazy_static::lazy_static;

#[derive(serde::Deserialize)]
pub struct Settings {
  pub database: DatabaseSettings,
  pub message_queue: MessageQueueSettings,
  pub chart_reference: ChartReferenceSettings,
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

lazy_static! {
  pub static ref CONFS: Settings = load_configuration().unwrap();
}
