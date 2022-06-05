class RenderingController {
  gl: WebGLRenderingContext;
  clearColor: [number, number, number, number];

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.clearColor = [1, 0, 0, 1];

    this.gl.clearColor.apply(this.gl, this.clearColor);
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}

export default RenderingController;
