
import { Color3, MeshBuilder, PBRMaterial, PhysicsAggregate, PhysicsShapeType, Scene, SceneLoader, StandardMaterial, Vector3 } from '@babylonjs/core'
import "@babylonjs/loaders";

export class Ramps {
    
    private pbr: PBRMaterial;
    private redMat: StandardMaterial;
    private greenMat: StandardMaterial;
    private blueMat: StandardMaterial;

    constructor(private scene: Scene) {
        this.createMaterials();
        this.createGround();
        this.createRamps();
        this.dropBall();
    }

    createMaterials(){
        this.redMat = new StandardMaterial("redMat", this.scene);
        this.redMat.emissiveColor = new Color3(1, 0, 0);
        this.greenMat = new StandardMaterial("redMat", this.scene);
        this.greenMat.emissiveColor = new Color3(0, 1, 0);

        this.blueMat = new StandardMaterial("blueMat", this.scene);
	    this.blueMat.emissiveColor = new Color3(0, 0, 1);
	    this.blueMat.diffuseColor = new Color3(0, 1, 1);
    }

    createGround(): void {

        const { scene } = this

        const ground = MeshBuilder.CreateGround('ground', { width: 20, height: 20 }, scene)
        //ground.material = this.blueMat;
        //ground.rotation.x = Math.PI / 5;
        
        new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene)
        
    }

    async createRamps(): Promise<void> {
        const ramps = await SceneLoader.ImportMeshAsync(
            "",
            "./model/",
            "rampa.glb",
            this.scene
        );

        ramps.meshes.map((mesh)=>mesh.material = this.greenMat)

        // var path =  SceneLoader
        // .ImportMesh("","https://raw.githubusercontent.com/leostereo/solidPath/main/","rampa.glb")

        console.log(ramps.meshes)
        ramps.meshes.map((m) => {
            const mAggregate = new PhysicsAggregate(m, PhysicsShapeType.BOX, { mass: 0 }, this.scene);
        })
        
        const mAggregate = new PhysicsAggregate(ramps.meshes[4], PhysicsShapeType.CYLINDER, { mass: 0 }, this.scene);

    }

    dropBall(): void {
        const ball = MeshBuilder.CreateSphere('myBall', { diameter: 1, segments: 32 }, this.scene)
        ball.position._y = 13;
        ball.position._x = 10;
        ball.position._z = 3;
        ball.material = this.redMat;
        new PhysicsAggregate(ball, PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, this.scene)

    }

}
