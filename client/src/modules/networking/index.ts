import { EventEmitter } from "events";
import * as b from "./arrayBufferUtils";
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
        this.sendPacket(
          OutboundPacketTypes.UpdatePosition,
          b.concat(b.num(performance.now()), b.num(20))
        );
      }, 50);
    });
    this.ws.addEventListener("close", () => this.emit("close"));
    this.ws.addEventListener("message", (msg) => this.emit("message", msg));
    this.ws.addEventListener("error", () => {
      console.log("error");
    });
  }

  sendPacket(type: OutboundPacketTypes, data: Uint8Array) {
    const packet = new Uint8Array(data.byteLength + 1);
    packet[0] = type;
    packet.set(data, 1);
    this.ws.send(packet);
  }
}

export default NetworkController;
