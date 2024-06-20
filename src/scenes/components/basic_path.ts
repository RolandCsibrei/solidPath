
import { Color3, Mesh, MeshBuilder, PBRMaterial, PhysicsAggregate, PhysicsBody, PhysicsMotionType, PhysicsShapeMesh, PhysicsShapeType, Scene, SceneLoader, StandardMaterial, Vector3 } from '@babylonjs/core'
import "@babylonjs/loaders";

export class BasicPath {

    private pbr: PBRMaterial;
    private redMat: StandardMaterial;
    private greenMat: StandardMaterial;
    private blueMat: StandardMaterial;

    constructor(private scene: Scene) {
        this.createMaterials();
        //this.createPath();
        this.loadCharacter();
        this.createGround();
        this.dropBall();
    }

    createMaterials() {
        this.redMat = new StandardMaterial("redMat", this.scene);
        this.redMat.emissiveColor = new Color3(1, 0, 0);
        this.greenMat = new StandardMaterial("redMat", this.scene);
        this.greenMat.emissiveColor = new Color3(0, 1, 0);

        this.blueMat = new StandardMaterial("blueMat", this.scene);
        this.blueMat.emissiveColor = new Color3(0, 0, 1);
        this.blueMat.diffuseColor = new Color3(0, 1, 1);
    }

    async createPath(): Promise<void> {
        const path = await SceneLoader.ImportMeshAsync(
            "",
            "./model/",
            "basic_path.glb",
            this.scene
        );


        path.meshes[1].material = this.greenMat

        const mAggregate1 = new PhysicsAggregate(path.meshes[1], PhysicsShapeType.BOX, { mass: 0 }, this.scene);
        const mAggregate2 = new PhysicsAggregate(path.meshes[2], PhysicsShapeType.BOX, { mass: 0 }, this.scene);
        const mAggregate3 = new PhysicsAggregate(path.meshes[3], PhysicsShapeType.BOX, { mass: 0 }, this.scene);
        const mAggregate4 = new PhysicsAggregate(path.meshes[4], PhysicsShapeType.BOX, { mass: 0 }, this.scene);


    }
    async loadCharacter(): Promise<void> {
        const character = await SceneLoader.ImportMeshAsync(
            "",
            "./animations/character/",
            "character.glb",
            this.scene
        );


        console.log(character.meshes)

        character.meshes[0].position.y = 1;
        // character.meshes[0].position.x = 7;

        character.meshes.forEach((mesh) => {
            new PhysicsAggregate(mesh, PhysicsShapeType.BOX, { mass: 1 }, this.scene);
        })
        character.animationGroups.forEach((animation) => animation.stop())


        console.log(character)


    }

    dropBall(): void {
        const ball = MeshBuilder.CreateSphere('myBall', { diameter: 0.3, segments: 32 }, this.scene)
        ball.position._y = 15
        ball.position._x = -4
        ball.position._z = 1

        ball.material = this.redMat;

        setInterval(() => {
            new PhysicsAggregate(ball, PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, this.scene)
        }, 1000)
    }
    createGround(): void {

        const ground = MeshBuilder.CreateGround('ground', { width: 20, height: 20 }, this.scene)
        new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, this.scene)

    }
}
