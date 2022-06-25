use std::string::String;
use warp::ws::Message;
pub mod bytes;
pub mod outbound_packet;

#[derive(Copy, Clone)]
pub enum IncomingPacketType {
    UpdatePosition = 1,
    Unknown = -1,
}

impl From<u8> for IncomingPacketType {
    fn from(orig: u8) -> Self {
        match orig {
            1 => return IncomingPacketType::UpdatePosition,
            _ => return IncomingPacketType::Unknown,
        };
    }
}

impl std::fmt::Display for IncomingPacketType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", *self as u8)
    }
}

pub struct IncomingPacket {
    pub packet_type: IncomingPacketType,
    pub data: Vec<u8>,
}

impl std::fmt::Display for IncomingPacket {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let mut bytes: String = String::new();

        for byte in &self.data {
            bytes += byte.to_string().as_str();
            bytes += " "
        }

        write!(f, "Type: {} -- {}", self.packet_type, bytes)
    }
}

pub fn decode_packet(msg: Message) -> Result<IncomingPacket, ()> {
    let bytes = msg.into_bytes();

    if bytes.len() == 0 {
        return Err(());
    }

    let packet = IncomingPacket {
        packet_type: bytes[0].into(),
        data: bytes[1..].to_owned(),
    };

    Ok(packet)
}
