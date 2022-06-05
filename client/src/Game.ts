import NetworkController from "./modules/networking";
import RenderingController from "./modules/rendering";

class Game {
  gl: WebGLRenderingContext;
  canvas: HTMLCanvasElement;

  renderer: RenderingController;
  network: NetworkController;

  constructor(canvas: HTMLCanvasElement) {
    console.log("Club Bears init!");

    // resize canvas
    this.resizeToFitWindow();
    window.addEventListener("resize", () => {
      this.resizeToFitWindow();
    });

    this.canvas = canvas;
    const gl = canvas.getContext("webgl");
    if (!gl) throw new Error("WebGL not supported!");
    this.gl = gl;

    this.renderer = new RenderingController(gl);
    this.renderer.clear();

    this.network = new NetworkController();
    this.network.on("message", console.log);
  }

  resizeToFitWindow() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
}

export default Game;
