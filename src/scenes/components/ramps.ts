
import { Color3, MeshBuilder, PBRMaterial, PhysicsAggregate, PhysicsShapeType, Scene, SceneLoader, StandardMaterial, Vector3 } from '@babylonjs/core'
import "@babylonjs/loaders";

export class Ramps {
    
    private pbr: PBRMaterial;
    private redMat: StandardMaterial;

    constructor(private scene: Scene) {
        this.createMaterials();
        this.createGround();
        this.createRamps();
        this.dropBall();
    }

    createMaterials(){
        this.redMat = new StandardMaterial("redMat", this.scene);
        this.redMat.emissiveColor = new Color3(1, 0, 0);
    }

    createGround(): void {

        const { scene } = this

        const ground = MeshBuilder.CreateGround('ground', { width: 20, height: 20 }, scene)
        ground.rotation.x = Math.PI / 5;
        ground.material = this.redMat;

        new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene)
    }

    async createRamps(): Promise<void> {
        const ramps = await SceneLoader.ImportMeshAsync(
            "",
            "./model/",
            "rampa.glb",
            this.scene
        );
        new PhysicsAggregate(ramps.meshes[0], PhysicsShapeType.BOX, { mass: 0 }, this.scene)



    }

    dropBall(): void {
        const ball = MeshBuilder.CreateSphere('myBall', { diameter: 2, segments: 32 }, this.scene)
        ball.position._y = 30;
        ball.position._x = -9;
        ball.position._z = 3;
        ball.material = this.redMat;
        new PhysicsAggregate(ball, PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, this.scene)

    }

}
