#[derive(serde::Deserialize)]
pub struct Settings {
  pub mq_url: String,
  // TODO: redis settings
}

pub fn load_configuration() -> Result<Settings, config::ConfigError> {
  let mut settings = config::Config::default();

  let base_path = std::env::current_dir()
    .expect("failed to load current dir");
  let config_dir = base_path.join("configuration");

  settings.merge(config::File::from(config_dir.join("base")).required(true))?;

  settings.try_into()
}
