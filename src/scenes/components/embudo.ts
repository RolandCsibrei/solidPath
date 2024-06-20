
import { Color3, Mesh, MeshBuilder, PBRMaterial, PhysicsAggregate, PhysicsBody, PhysicsMotionType, PhysicsShapeMesh, PhysicsShapeType, Scene, SceneLoader, StandardMaterial, Vector3 } from '@babylonjs/core'
import "@babylonjs/loaders";

export class Embudo {
    
    private pbr: PBRMaterial;
    private redMat: StandardMaterial;
    private greenMat: StandardMaterial;
    private blueMat: StandardMaterial;

    constructor(private scene: Scene) {
        this.createMaterials();
        this.createGround();
        this.createPath();
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
        
        new PhysicsAggregate(ground, PhysicsShapeType.CONVEX_HULL, { mass: 0 }, scene)
        
    }

    async createPath(): Promise<void> {
        const ramps = await SceneLoader.ImportMeshAsync(
            "",
            "./model/",
            "embudo.glb",
            this.scene
        );
        

         ramps.meshes[1].material = this.greenMat
         
         const mAggregate1 = new PhysicsAggregate(ramps.meshes[1], PhysicsShapeType.MESH, { mass: 0 }, this.scene);
         const mAggregate2 = new PhysicsAggregate(ramps.meshes[2], PhysicsShapeType.MESH, { mass: 0 }, this.scene);
      

    }

    dropBall(): void {
        const ball = MeshBuilder.CreateSphere('myBall', { diameter: 0.3, segments: 32 }, this.scene)
        ball.position._y =7
        ball.position._x =-4
        ball.position._z =0

        ball.material = this.redMat;

        setInterval(()=>{
            new PhysicsAggregate(ball, PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, this.scene)
        },1000)

    }

}
