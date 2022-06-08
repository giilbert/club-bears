import { getGame } from "../../Game";

// wrapper around WebGLTexture
class TextureResource {
  public url: string;
  public texture: WebGLTexture;

  constructor(url: string) {
    this.url = url;
    this.texture = {} as WebGLTexture;
  }

  async load() {
    const gl = getGame().gl;
    const resource = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", () => reject());
      image.src = this.url;
    });

    const texture = gl.createTexture();
    if (!texture) throw "Texture creation failed.";
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      resource
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    this.texture = texture;

    return this;
  }
}

export default TextureResource;
