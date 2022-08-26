FROM rust:1.63.0-slim-buster as build

RUN User=root cargo new --bin stock_tracker
WORKDIR ./build
COPY ./Cargo.toml ./Cargo.toml
RUN cargo build --release
RUN rm src/*.rs

ADD ./src ./src
RUN rm ./target/release/deps/stock_tracker*
RUN cargo build --release

FROM debian:buster-slim

WORKDIR /usr/bin/app
COPY --from=build ./tester/target/release/stock_tracker .

EXPOSE 1333

ENTRYPOINT ["/usr/bin/app/stock_tracker"]
