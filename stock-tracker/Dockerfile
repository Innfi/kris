FROM ubuntu:22.04 as build

RUN apt-get -qq update
RUN apt-get install -y -q build-essential curl
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
RUN apt-get install libglib2.0-0 libglib2.0-data libicu70 libxml2 shared-mime-info xdg-user-dirs pkg-config
RUN apt-get install libssl-dev
ENV PATH="/root/.cargo/bin:${PATH}"

RUN User=root cargo new --bin stock_tracker
WORKDIR ./build
COPY ./Cargo.toml ./Cargo.toml
COPY ./src ./src
RUN cargo build --release
RUN rm src/*.rs

ADD ./src ./src
RUN rm ./target/release/deps/stock_tracker*
RUN cargo build --release

FROM ubuntu:22.04

WORKDIR /usr/bin/app
COPY --from=build ./build/target/release/stock_tracker .

EXPOSE 1333

ENTRYPOINT ["/usr/bin/app/stock_tracker"]
