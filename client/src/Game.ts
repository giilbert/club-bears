import NetworkController from "./modules/networking";
import RenderingController from "./modules/rendering";
import Mesh from "./modules/rendering/Mesh";
import Shader from "./modules/rendering/Shader";

class Game {
  gl: WebGL2RenderingContext;
  canvas: HTMLCanvasElement;

  renderer: RenderingController;
  network: NetworkController;

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

    setTimeout(() => this.draw());
  }

  resizeToFitWindow() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  draw() {
    // prettier-ignore
    const vertices = [
      0.5, 0.5,
      0.5, -0.5,
      -0.5, -0.5,
      -0.5, 0.5,
    ];
    // prettier-ignore
    const indices = [
      0, 1, 2,
      0, 2, 3
    ];

    const shader = new Shader(
      `#version 300 es
in vec3 aVertexPosition;

void main() {
  gl_Position = vec4(aVertexPosition, 1.0);
}
      `,
      `#version 300 es
precision mediump float;

out vec4 outColor;

void main() {
  outColor = vec4(0.0, 1.0, 0.0, 1.0);
}
`
    );
    const mesh = new Mesh(vertices, indices);

    mesh.attachShader(shader);
    mesh.draw();
  }
}

export function getGame() {
  if (!window.__ClubBears?.game)
    throw "Cannot access game before initialization";
  return window.__ClubBears.game;
}

export default Game;
