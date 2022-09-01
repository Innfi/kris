use actix_web::dev::Server;
use actix_web::{web, App, HttpServer};
use log::info;
use std::net::TcpListener;

use crate::configuration::CONFS;
use crate::routes::health_check;

pub fn run_http_server() -> Result<Server, std::io::Error> {
  let addr = CONFS.healthcheck.addr.as_str();
  info!("run_http_server: {}", addr);
  let listener = TcpListener::bind(addr)?;

  let server = HttpServer::new(move || {
    App::new().route("/health_check", web::get().to(health_check))
  })
  .listen(listener)?
  .run();

  //result;

  Ok(server)
  // Ok(
  //   HttpServer::new(move || {
  //     App::new().route("/health_check", web::get().to(health_check))
  //   })
  //   .listen(listener)?
  //   .run(),
  // )
}
