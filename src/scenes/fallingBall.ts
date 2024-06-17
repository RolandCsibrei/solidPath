import { ArcRotateCamera, Engine, Scene, Tools, HemisphericLight, Vector3 } from "@babylonjs/core";
import { Ramps } from "./components/ramps";


export class FallingBallScene {

    private camera: ArcRotateCamera;

    constructor(private scene: Scene,
        private canvas: HTMLCanvasElement,
        private engine: Engine) {
        console.log("falling scene building")
        this.setCamera(this.scene);
        this.setLight(this.scene)
        this.loadComponents()
    }

    setCamera(scene: Scene): void {
        this.camera = new ArcRotateCamera('camera', Tools.ToRadians(160), Tools.ToRadians(60), 70, Vector3.Zero(), scene)
        this.camera.attachControl(this.canvas, true)
        this.camera.setTarget(Vector3.Zero())
    }

    setLight(scene: Scene): void {
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)
        light.intensity = 0.7
    }

    loadComponents(): void {
        // Load your files in order
        new Ramps(this.scene)
    }

}