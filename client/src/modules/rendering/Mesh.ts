import { getGame, getGl } from "../../Game";
import Shader from "./Shader";

const VERTEX_SIZE = 2;

class Mesh {
  vao: WebGLVertexArrayObject;
  indicesLength: number;

  vertexBuffer: WebGLBuffer | null;
  uvBuffer: WebGLBuffer | null;

  constructor(vertices: number[], indices: number[], uvs: number[]) {
    const gl = getGl();

    const vao = gl.createVertexArray();
    if (!vao) throw "Unable to create VAO";
    gl.bindVertexArray(vao);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint8Array(indices),
      gl.STATIC_DRAW
    );

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

    this.indicesLength = indices.length;
    this.vao = vao;
    this.vertexBuffer = vertexBuffer;
    this.uvBuffer = uvBuffer;
  }

  attachShader(shader: Shader) {
    const gl = getGl();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(
      shader.attributeLocations.aVertexPosition,
      VERTEX_SIZE,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(shader.attributeLocations.aVertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.vertexAttribPointer(
      shader.attributeLocations.aTexCoord,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(shader.attributeLocations.aTexCoord);
  }

  draw() {
    const gl = getGame().gl;
    gl.drawElements(gl.TRIANGLES, this.indicesLength, gl.UNSIGNED_BYTE, 0);
  }
}

export default Mesh;
