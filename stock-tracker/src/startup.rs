use actix_web::dev::Server;
use actix_web::{web, App, HttpServer};
use std::net::TcpListener;

use crate::routes::{health_check};

pub fn run_http_server() -> Result<Server, std::io::Error> {
  //FIXME: read address / port from env
  let listener = TcpListener::bind("127.0.0.1:1333")?;

  let server = HttpServer::new(move || {
    App::new()
      .route("/health_check", web::get().to(health_check))
  })
  .listen(listener)?
  .run();

  Ok(server)
}