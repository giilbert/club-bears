use serde::Serialize;
use serde_repr::Serialize_repr;
use warp::ws::Message;

#[derive(Serialize)]
pub struct OutboundPacket {
    pub packet_type: OutboundPacketType,
    pub data: String,
}

#[derive(Serialize_repr)]
#[repr(u8)]
pub enum OutboundPacketType {
    HandshakeReply,
    UpdatePosition,
}

impl Into<Result<Message, warp::Error>> for OutboundPacket {
    fn into(self) -> Result<Message, warp::Error> {
        let json = serde_json::to_string(&self).unwrap();
        Ok(Message::text(json))
    }
}
