use futures_util::{SinkExt, StreamExt};
use tokio::time::{sleep, Duration};
use warp::ws::{Message, WebSocket};
use warp::Filter;

#[tokio::main]
async fn main() {
    let chat = warp::path!("ws")
        .and(warp::ws())
        .map(|ws: warp::ws::Ws| ws.on_upgrade(move |socket| on_connection(socket)));

    warp::serve(chat).run(([127, 0, 0, 1], 3001)).await;
}

async fn on_connection(socket: WebSocket) {
    println!("connection!");

    let (mut socket_sender, mut _socket_receiver) = socket.split();

    tokio::task::spawn(async move {
        loop {
            sleep(Duration::from_secs(1)).await;
            socket_sender.send(Message::text("hello!!!")).await.unwrap();
        }
    });
}

