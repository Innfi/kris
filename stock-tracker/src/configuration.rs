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

// FIXME: global object for configuration
pub fn load_configuration() -> Result<Settings, config::ConfigError> {
  let mut settings = config::Config::default();

  let base_path = std::env::current_dir().expect("failed to load current dir");
  let config_dir = base_path.join("configuration");

  settings.merge(config::File::from(config_dir.join("base")).required(true))?;
  settings.merge(config::File::from(config_dir.join("ref")).required(true))?;

  settings.try_into()
}
