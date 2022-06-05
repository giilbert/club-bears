import { EventEmitter } from "events";

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

    this.ws.addEventListener("open", () => this.emit("open"));
    this.ws.addEventListener("close", () => this.emit("close"));
    this.ws.addEventListener("message", (msg) => this.emit("message", msg));
    this.ws.addEventListener("error", () => {
      console.log("error");
    });
  }
}

export default NetworkController;
