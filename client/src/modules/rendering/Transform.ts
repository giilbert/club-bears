import { mat4, vec3, quat } from "gl-matrix";

class Transform {
  position: vec3;
  scale: vec3;
  rotation: quat;
  matrix: mat4;

  constructor() {
    this.position = vec3.create();
    this.scale = vec3.fromValues(1, 1, 1);
    this.rotation = quat.create();
    this.matrix = mat4.create();
  }

  updateTransform() {
    const matrix = mat4.create();
    this.matrix = mat4.fromRotationTranslationScale(
      matrix,
      this.rotation,
      this.position,
      this.scale
    );
  }
}

export default Transform;
