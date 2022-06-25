import { EventEmitter } from "events";
import { OutboundPacketTypes } from "./PacketTypes";

const WEBSOCKET_SERVER_URL = "ws://localhost:3001/ws";

declare interface NetworkController {
  on(event: "open", listener: () => void): this;
  on(event: "close", listener: () => void): this;
  on(event: "message", listener: (msg: MessageEvent<any>) => void): this;
  on(event: "error", listener: () => void): this;
}

class NetworkController extends EventEmitter {
  ws: WebSocket;

  constructor() {
    super();
    this.ws = new WebSocket(WEBSOCKET_SERVER_URL);
    this.ws.binaryType = "arraybuffer";

    this.ws.addEventListener("open", () => {
      this.emit("open");
      setInterval(() => {
        this.sendPacket(OutboundPacketTypes.UpdatePosition, {
          x: 10,
          y: 20,
        });
      }, 50);
    });
    this.ws.addEventListener("close", () => this.emit("close"));
    this.ws.addEventListener("message", (msg) => this.onPacket(msg));
    this.ws.addEventListener("error", () => {
      console.log("error");
    });
  }

  onPacket(message: MessageEvent) {
    console.log(message.data)
    const { type, data } = JSON.parse(message.data);
    this.emit(type, JSON.parse(data));
  }

  sendPacket(type: OutboundPacketTypes, data: any) {
    this.ws.send(
      JSON.stringify({
        packet_type: type,
        data: JSON.stringify(data),
      })
    );
  }
}

export default NetworkController;
