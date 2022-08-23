//use actix_web::dev::Server;
use actix_web::{web, App, HttpServer};
use log::{info, error};
use std::net::TcpListener;
use tokio::signal;

use crate::configuration::CONFS;
use crate::routes::health_check;

pub async fn run_http_server() -> Result<(), std::io::Error> {
  info!("run_http_server");
  let addr = CONFS.healthcheck.addr.as_str();
  let listener = TcpListener::bind(addr)?;

  //let server = 
  let _ = HttpServer::new(move || {
    App::new().route("/health_check", web::get().to(health_check))
  })
  .listen(listener)?
  .run();

  match signal::ctrl_c().await {
    Ok(()) => {
      info!("received signal");
      return Ok(());
    },
    Err(err) => {
      error!("signal error: {}", err);
      return Err(err);
    },
  }

  //Ok(server)
  // Ok(())
}
