import TextureResource from "./TextureResource";

const TEXTURES = ["/bear.png"];

class ResourcesController {
  textures: Record<string, TextureResource>;

  constructor() {
    this.textures = {};
  }

  async load() {
    this.textures = Object.fromEntries(
      (
        await Promise.all(
          TEXTURES.map((url) => new TextureResource(url).load())
        )
      ).map((res) => [res.url, res])
    );
  }
}

export default ResourcesController;
