use serde::Deserialize;
use serde_repr::Deserialize_repr;
use std::string::String;
use warp::ws::Message;
pub mod outbound_packet;

#[derive(Copy, Clone, Deserialize_repr)]
#[repr(u8)]
pub enum IncomingPacketType {
    UpdatePosition = 1,
}

#[derive(Deserialize)]
pub struct IncomingPacket {
    pub packet_type: IncomingPacketType,
    pub data: String,
}

pub fn decode_packet(msg: Message) -> Result<IncomingPacket, ()> {
    let text = msg.to_str();

    if text.is_err() {
        return Err(());
    }

    let data: IncomingPacket = serde_json::from_str(text.unwrap()).unwrap();

    Ok(data)
}
