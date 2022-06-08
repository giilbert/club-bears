import { mat4 } from "gl-matrix";
import Mesh from "./Mesh";
import Shader from "./Shader";

// prettier-ignore
const vertices = [
  1, 1,
  1, -1,
  -1, -1,
  -1, 1,
];
// prettier-ignore
const indices = [
  0, 1, 2,
  0, 2, 3,
];
// prettier-ignore
const uvs = [
  1, 0,
  1, 1,
  0, 1,
  0, 0,
];

class RenderingController {
  gl: WebGLRenderingContext;
  clearColor: [number, number, number, number];
  spriteShader: Shader;
  planeMesh: Mesh;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.clearColor = [0.1, 0.1, 0.1, 1];

    gl.clearColor.apply(gl, this.clearColor);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.spriteShader = new Shader(
      `#version 300 es
in vec3 aVertexPosition;
in vec2 aTexCoord;
out vec2 texCoord;

void main() {
  texCoord = aTexCoord;
  gl_Position = vec4(aVertexPosition, 1.0);
}
      `,
      `#version 300 es
precision mediump float;

uniform sampler2D uSampler;
in vec2 texCoord;
out vec4 outColor;

void main() {
  outColor = texture(uSampler, texCoord);
//  outColor = vec4(texCoord, 0.0, 1.0);
}
`,
      [],
      ["uSampler"]
    );

    this.planeMesh = new Mesh(vertices, indices, uvs);
    this.planeMesh.attachShader(this.spriteShader);
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  draw() {
    this.gl.uniform1i(this.spriteShader.uniformLocations.uSampler, 0);

    const b = () => {
      this.clear();
      this.planeMesh.draw();

      requestAnimationFrame(b);
    };

    requestAnimationFrame(b);
  }
}

export default RenderingController;
