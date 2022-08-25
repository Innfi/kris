use actix_web::dev::Server;
use actix_web::{web, App, HttpServer};
use log::info;
use std::net::TcpListener;

use crate::configuration::CONFS;
use crate::routes::health_check;

pub async fn run_http_server() -> Result<Server, std::io::Error> {
  info!("run_http_server");
  let addr = CONFS.healthcheck.addr.as_str();
  let listener = TcpListener::bind(addr)?;

  Ok(
    HttpServer::new(move || {
      App::new().route("/health_check", web::get().to(health_check))
    })
    .listen(listener)?
    .run(),
  )
}
