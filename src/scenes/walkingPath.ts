import { ArcRotateCamera, Engine, Scene, Tools, HemisphericLight, Vector3, Color3, SpotLight, DirectionalLight, IEnvironmentHelperOptions, MeshBuilder, StandardMaterial, CubeTexture, Texture } from "@babylonjs/core";
import { Ramps } from "./components/ramps";
import { Embudo } from "./components/embudo";
import { BasicPath } from "./components/basic_path";


export class WalkingPath {

    private camera: ArcRotateCamera;

    constructor(private scene: Scene,
        private canvas: HTMLCanvasElement,
        private engine: Engine) {
        this.setSceneSkyBox(this.scene);
        this.setCamera(this.scene);
        this.setLight(this.scene)
        this.loadComponents()
    }

    setSceneSkyBox(scene: Scene):void{
    // Skybox with standardMaterial

	var skybox = MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
	var skyboxMaterial = new StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new CubeTexture("textures/skybox", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
	skybox.material = skyboxMaterial;
	skyboxMaterial.disableLighting = true;

}

    setCamera(scene: Scene): void {
        this.camera = new ArcRotateCamera('camera', Tools.ToRadians(-30), Tools.ToRadians(40), 60, Vector3.Zero(), scene)
        this.camera.attachControl(this.canvas, true)
        this.camera.setTarget(Vector3.Zero())
    }

    setLight(scene: Scene): void {
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)
        light.intensity = 0.7;
    }

    loadComponents(): void {
        // Load your files in order
        new BasicPath(this.scene)
    }

}