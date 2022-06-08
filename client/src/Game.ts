import NetworkController from "./modules/networking";
import RenderingController from "./modules/rendering";
import ResourcesController from "./modules/resources";

class Game {
  gl: WebGL2RenderingContext;
  canvas: HTMLCanvasElement;

  renderer: RenderingController;
  network: NetworkController;
  resources: ResourcesController;

  constructor(canvas: HTMLCanvasElement) {
    console.log("Club Bears init!");
    this.canvas = canvas;

    // resize canvas
    this.resizeToFitWindow();
    window.addEventListener("resize", () => {
      this.resizeToFitWindow();
    });

    const gl = canvas.getContext("webgl2");
    if (!gl) throw new Error("WebGL2 not supported!");
    this.gl = gl;

    this.renderer = new RenderingController(gl);
    this.renderer.clear();

    this.network = new NetworkController();
    this.network.on("message", console.log);

    this.resources = new ResourcesController();

    setTimeout(() => {
      this.resources.load().then(() => {
        this.renderer.draw();
      });
    });
  }

  resizeToFitWindow() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
}

export function getGame() {
  if (!window.__ClubBears?.game)
    throw "Cannot access game before initialization";
  return window.__ClubBears.game;
}

export default Game;
