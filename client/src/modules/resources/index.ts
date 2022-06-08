import TextureResource from "./TextureResource";

class ResourcesController {
  textures: Record<string, TextureResource>;

  constructor() {
    this.textures = {};
  }

  async load() {
    this.textures = Object.fromEntries(
      (await Promise.all([new TextureResource("/bear.png").load()])).map(
        (res) => {
          return [res.url, res];
        }
      )
    );
    console.log(this.textures);
  }
}

export default ResourcesController;
