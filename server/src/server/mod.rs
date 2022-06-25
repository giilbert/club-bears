use std::collections::HashMap;
use std::sync::Arc;
use futures_util::StreamExt;
use tokio::sync::RwLock;
use tokio_stream::wrappers::UnboundedReceiverStream;
use warp::ws::{Message, WebSocket};
use warp::Filter;
use tokio::sync::mpsc;
use uuid::Uuid;

use crate::packet::outbound_packet::*;
use crate::packet;
use crate::server::structs::*;
mod players;
mod structs;

#[derive(Clone, Debug)]
pub struct Player {
    position: Vec2,
    sender: mpsc::UnboundedSender<Result<Message, warp::Error>>
}

type Players = Arc<RwLock<HashMap<Uuid, Player>>>;

pub async fn start() {
    let players = Players::default();
    let players = warp::any().map(move || players.clone());

    let chat = warp::path!("ws")
        .and(warp::ws())
        .and(players)
        .map(|ws: warp::ws::Ws, players| {
            ws.on_upgrade(move |socket| on_connection(socket, players))
        });

    warp::serve(chat).run(([127, 0, 0, 1], 3001)).await;
}

pub async fn on_connection(socket: WebSocket, players: Players) {
    println!("Socket connected!");

    let socket_id = Uuid::new_v4();
    let (socket_sender, mut socket_receiver) = socket.split();

    let (client_sender, client_receiver) = mpsc::unbounded_channel();
    let client_receiver = UnboundedReceiverStream::new(client_receiver);
    tokio::task::spawn(client_receiver.forward(socket_sender));

    let mut player = Player {
        position: Vec2::default(),
        sender: client_sender
    };

    players.write().await.insert(socket_id, player.clone());

    player.sender.send((OutboundPacket {
        packet_type: OutboundPacketType::HandshakeReply,
        data: serde_json::to_string(&HandshakeResponse {
            id: socket_id.to_string()
        }).unwrap()
    }).into()).unwrap();

    while let Some(result) = socket_receiver.next().await {
        use packet::IncomingPacketType;

        let msg = match result {
            Ok(msg) => msg,
            Err(_) => {
                println!("Error happened decoding message");
                break;
            }
        };

        let packet = packet::decode_packet(msg);
        if packet.is_err() {
            continue;
        }

        let packet = packet.unwrap();
        match packet.packet_type {
            IncomingPacketType::UpdatePosition => players::update_position(&mut player, packet, &players).await,
        }
    }

    players.write().await.remove(&socket_id);
}

