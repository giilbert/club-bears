import { getGame, getGl } from "../../Game";

function compileProgram(type: number, source: string) {
  const gl = getGl();
  const shader = gl.createShader(type);
  if (!shader) throw "Shader creation error";

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const info = gl.getShaderInfoLog(shader);
  if (info) {
    console.log("Shader compilation error\n", info);
    throw "Shader compilation failed";
  }

  return shader;
}

type AttributeList = "aVertexPosition" | "aTexCoord" | string;

type UniformsList =
  | "uTime"
  | "uModelMatrix"
  | "uViewMatrix"
  | "uProjectionMatrix"
  | string;

class Shader {
  program: WebGLProgram;
  attributeLocations: Record<AttributeList, number>;
  uniformLocations: Record<UniformsList, WebGLUniformLocation | null>;

  constructor(
    vertexSource: string,
    fragmentSource: string,
    attributes: string[] = [],
    uniforms: string[] = []
  ) {
    const gl = getGl();

    const vertexShader = compileProgram(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileProgram(gl.FRAGMENT_SHADER, fragmentSource);

    const program = gl.createProgram();
    if (!program) throw "Shader program creation error";
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    this.program = program;
    gl.useProgram(program);

    // attributes
    this.attributeLocations = {
      aVertexPosition: gl.getAttribLocation(program, "aVertexPosition"),
      aTexCoord: gl.getAttribLocation(program, "aTexCoord"),
    };

    attributes.forEach((name) => {
      this.attributeLocations[name] = gl.getAttribLocation(program, name);
    });

    // uniforms
    this.uniformLocations = {
      uTime: gl.getUniformLocation(program, "uTime"),
      uModelMatrix: gl.getUniformLocation(program, "uProjectionMatrix"),
      uViewMatrix: gl.getUniformLocation(program, "uViewMatrix"),
      uProjectionMatrix: gl.getUniformLocation(program, "uProjectionMatrix"),
    };

    uniforms.forEach((name) => {
      this.uniformLocations[name] = gl.getUniformLocation(program, name);
    });
  }
}

export default Shader;
