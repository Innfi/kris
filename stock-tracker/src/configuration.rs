#[derive(serde::Deserialize)]
pub struct Settings {
  pub database: DatabaseSettings,
  pub message_queue: MessageQueueSettings,
}

#[derive(serde::Deserialize)]
pub struct DatabaseSettings {
  pub redis_host: String,
  pub redis_port: u16,
}

#[derive(serde::Deserialize)]
pub struct MessageQueueSettings {
  pub mq_url: String,
}

pub fn load_configuration() -> Result<Settings, config::ConfigError> {
  let mut settings = config::Config::default();

  let base_path = std::env::current_dir().expect("failed to load current dir");
  let config_dir = base_path.join("configuration");

  settings.merge(config::File::from(config_dir.join("base")).required(true))?;

  settings.try_into()
}
