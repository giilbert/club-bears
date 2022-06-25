use serde::{Deserialize, Serialize};

#[derive(PartialEq, Clone, Debug, Default, Deserialize, Serialize)]
pub struct Vec2 {
    pub x: f64,
    pub y: f64,
}

#[derive(PartialEq, Clone, Debug, Default, Deserialize, Serialize)]
pub struct HandshakeResponse {
    pub id: String,
}
