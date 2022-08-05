FROM rust:1.61.0 as builder

WORKDIR /usr/src

RUN ["USER=root", "cargo", "new", "stock_tracker_build"]

COPY ["./Cargo.toml", "./Cargo.lock", "/usr/src/stock_tracker_build/"]

WORKDIR /usr/src/stock_tracker_build

RUN ["rustup", "target", "add", "x86_64-unknown-linux-musl"]
RUN ["cargo", "build", "--target", "x86_64-unknown-linux-musl", "--release"]

COPY ["src", "/usr/src/stock_tracker_build"]
RUN ["touch" "/usr/src/stock_tracker_build/src/main.rs"]
RUN ["cargo", "build", "--target", "x86_64-unknown-linux-musl", "--release"]

FROM alpine:3.16.0 AS runtime

COPY --from=builder /usr/src/stock_tracker_build/target/x86_64-unknown-linux-musl/release/stock_tracker /usr/local/bin

EXPOSE 1333

# CMD ["/usr/local/bin/stock_tracker"]
