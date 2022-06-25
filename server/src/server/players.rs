use crate::server::packet::IncomingPacket;
use crate::server::{Player, Players, structs::*};
use crate::packet::outbound_packet::{OutboundPacket, OutboundPacketType};

pub async fn update_position(player: &mut Player, packet: IncomingPacket, players: &Players) {
    let position: Vec2 = serde_json::from_str(&packet.data).unwrap();

    player.position = position;

    // broadcast position change to everyone
    for player in players.write().await.values() {
        player.sender.send(OutboundPacket {
            packet_type: OutboundPacketType::UpdatePosition,
            data: serde_json::to_string(&Vec2 {
                x: 10.0,
                y: 20.0
            }).unwrap()
        }.into()).unwrap();
    }
}
