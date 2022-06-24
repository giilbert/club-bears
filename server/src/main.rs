mod server;
mod packet;

#[tokio::main]
async fn main() {
    server::start().await;
}

