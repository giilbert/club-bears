import TextureResource from "./TextureResource";

class ResourcesController {
  constructor() {}

  async load() {
    await new TextureResource("/bear.png").load();
  }
}

export default ResourcesController;
