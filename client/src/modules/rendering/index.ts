import { mat4, quat, vec3 } from "gl-matrix";
import Mesh from "./Mesh";
import Shader from "./Shader";
import Transform from "./Transform";

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

uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;

void main() {
  texCoord = aTexCoord;
  gl_Position = uProjectionMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
}
      `,
      `#version 300 es
precision mediump float;

uniform sampler2D uSampler;
in vec2 texCoord;
out vec4 outColor;

void main() {
  outColor = texture(uSampler, texCoord);
}
`,
      [],
      ["uSampler"]
    );

    this.planeMesh = new Mesh(vertices, indices, uvs);
    this.planeMesh.attachShader(this.spriteShader);

    requestAnimationFrame(() => this.draw());
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  draw() {
    const projection = mat4.create();
    const aspectRatio = window.innerWidth / window.innerHeight;

    const SIZE = 4;
    mat4.ortho(
      projection,
      -SIZE * aspectRatio,
      SIZE * aspectRatio,
      -SIZE,
      SIZE,
      0,
      100
    );

    this.gl.uniform1i(this.spriteShader.uniformLocations.uSampler, 0);
    this.gl.uniformMatrix4fv(
      this.spriteShader.uniformLocations.uProjectionMatrix,
      false,
      projection
    );

    const transform = new Transform();
    quat.rotateZ(
      transform.rotation,
      transform.rotation,
      performance.now() / 400
    );
    transform.position = vec3.fromValues(performance.now() / 1000, 0, 0);
    transform.updateTransform();

    this.gl.uniformMatrix4fv(
      this.spriteShader.uniformLocations.uModelMatrix,
      false,
      transform.matrix
    );

    this.clear();
    this.planeMesh.draw();

    requestAnimationFrame(() => this.draw());
  }
}

export default RenderingController;
