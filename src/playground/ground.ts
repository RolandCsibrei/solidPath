import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import '@babylonjs/loaders'

export class Ground {
  constructor(private scene: BABYLON.Scene) {
    this._createGround();
    this._createSphere();
    this._generateRandomPlatforms();
  }

  _createGround(): void {
    const { scene } = this

    const mesh = BABYLON.MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene)
    new BABYLON.PhysicsAggregate(mesh, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene)
  }

  _createSphere(): void {
    const mesh = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 2, segments: 32 }, this.scene)
    mesh.position.y = 4

    new BABYLON.PhysicsAggregate(mesh, BABYLON.PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, this.scene)
  }

  async _generateRandomPlatforms() {
    const path1 = BABYLON.MeshBuilder.CreateBox(
      BABYLON.PhysicsShapeType.BOX + '',
      { size: 10, height: 0.2, width: 2 },
      this.scene
    );
    path1.position = new BABYLON.Vector3(0, 0, 5)
    this.addPhysicsAggregate(path1);

    const ramps = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "./model/",
      "basic_path.glb",
      this.scene
    );
    ramps.meshes[0].position = new BABYLON.Vector3(0, -12, -6)
    for (const ramp of ramps.meshes) {
      this.addPhysicsAggregate(ramp);

    }
  }

  private addPhysicsAggregate(meshe: BABYLON.TransformNode) {
    const res = new BABYLON.PhysicsAggregate(
      meshe,
      BABYLON.PhysicsShapeType.BOX,
      { mass: 0, friction: 0.5 },
      this.scene
    );
    // this.physicsViewer.showBody(res.body);
    return res;
  }
}
