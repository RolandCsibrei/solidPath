
import { MeshBuilder, PhysicsAggregate, PhysicsShapeType, Scene, SceneLoader, Vector3 } from '@babylonjs/core'
import "@babylonjs/loaders";

export class Ramps {
    constructor(private scene: Scene) {

        this.createGround();
        this.createRamps();
        this.dropBall();
    }

    createGround(): void {
        console.log("ground")
        const { scene } = this

        const mesh = MeshBuilder.CreateGround('ground', { width: 20, height: 20 }, scene)
        mesh.rotation.x = Math.PI/5;
        new PhysicsAggregate(mesh, PhysicsShapeType.BOX, { mass: 0 }, scene)
    }

    async createRamps(): Promise<void> {
        const ramps = await SceneLoader.ImportMeshAsync(
            "",
            "./model/",
            "rampa.glb",
            this.scene

        );

    }

    dropBall(): void {
        const ball = MeshBuilder.CreateSphere('myBall', { diameter: 2, segments: 32 }, this.scene)
        ball.position._y = 30;
        ball.position._x = -9;
        ball.position._z = 3;
        new PhysicsAggregate(ball, PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, this.scene)

    }

}
