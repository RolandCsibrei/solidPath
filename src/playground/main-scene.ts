import '@babylonjs/loaders'
import { CharacterController } from './CharacterController';
import { AnimationGroup, ArcRotateCamera, Engine, HemisphericLight, Mesh, MeshBuilder, SceneLoader, StandardMaterial, Vector3 } from '@babylonjs/core';

export default class MainScene {

  private allAGs: AnimationGroup[];
  private cc: CharacterController;

  constructor(private scene: Scene, private canvas: HTMLCanvasElement, private engine: Engine) {
    this.setCamNLight();
    //this.loadPlayer();
    this.loadPlayerAsync();
  }

  setCamNLight() {

    var camera1 = new ArcRotateCamera("camera1", 3 * Math.PI / 8, 3 * Math.PI / 8, 15, new Vector3(0, 2, 0), this.scene);
    camera1.attachControl(this.canvas, true);
    // this.camera = camera1;

    // lights
    var light1 = new HemisphericLight("light1", new Vector3(1, 0.5, 0), this.scene);
    light1.intensity = 0.7;
    var light2 = new HemisphericLight("light2", new Vector3(-1, -0.5, 0), this.scene);
    light2.intensity = 0.2;

    var box = MeshBuilder.CreateBox("Box", { size: 1 }, this.scene);
    box.material = new StandardMaterial("", this.scene);
    box.position.x += 5
    box.checkCollisions = true;

  }

  loadPlayer() {
    SceneLoader.ImportMesh("", "model/", "Vincent-frontFacing.glb", this.scene, (meshes, particleSystems, skeletons) => {
      var player = meshes[0];

      debugger

      //clean up this player mesh
      //it has camera and lights, lets remove them
      let m = meshes[0].getChildren();
      let l = m.length - 1;
      for (let i = l; i >= 0; i--) {
        if (m[i].name == "Camera" || m[i].name == "Hemi" || m[i].name == "Lamp") m[i].dispose();
      }

      player.position = new Vector3(0, 0, 0);
      player.checkCollisions = true;

      player.ellipsoid = new Vector3(0.5, 1, 0.5);
      player.ellipsoidOffset = new Vector3(0, 1, 0);

      // character controller  needs rotation in euler.
      // if your mesh has rotation in quaternion then convert that to euler.
      // NOTE: The GLTF/GLB files have rotation in quaternion
      player.rotation = player.rotationQuaternion.toEulerAngles();
      player.rotationQuaternion = null;

      //rotate the camera behind the player
      //.glbs are RHS
      player.rotation.y = Math.PI / 4;
      var alpha = (3 * Math.PI) / 2 - player.rotation.y;
      var beta = Math.PI / 2.5;
      var target = new Vector3(player.position.x, player.position.y + 1.5, player.position.z);
      var camera = new ArcRotateCamera("ArcRotateCamera", alpha, beta, 5, target, this.scene);

      // make sure the keyboard keys controlling camera are different from those controlling player
      // here we will not use any keyboard keys to control camera
      camera.keysLeft = [];
      camera.keysRight = [];
      camera.keysUp = [];
      camera.keysDown = [];

      // below are all standard camera settings.
      // nothing specific to charcter controller
      camera.wheelPrecision = 15;
      camera.checkCollisions = false;
      // how close can the camera come to player
      camera.lowerRadiusLimit = 2;
      // how far can the camera go from the player
      camera.upperRadiusLimit = 20;
      camera.attachControl(this.canvas, false);

      // provide all your animation groups as a map to the character controller
      // the map should have
      // key = the name of the character controller  animation
      // and
      // value = the AnimationGroup corresponding to that animation.

      this.allAGs = this.scene.animationGroups;

      //stop all animations
      //also lets print to console the list of animation groups we have in this file, to help map them properly
      for (let i = 0; i < this.allAGs.length; i++) {
        this.allAGs[i].stop();
        console.log(i + "," + this.allAGs[i].name);
      }

      var agMap = this.createAGmap(this.allAGs);

      this.cc = new CharacterController(player, camera, this.scene, agMap, true);

      this.cc.setMode(0);
      //below makes the controller point the camera at the player head which is approx
      //1.5m above the player origin
      this.cc.setCameraTarget(new Vector3(0, 2, 0));

      //if the camera comes close to the player then we want this.cc to enter first person mode.
      this.cc.setNoFirstPerson(false);
      //the height of steps which the player can climb
      this.cc.setStepOffset(0.4);
      //the minimum and maximum slope the player can go up
      //between the two the player will start sliding down if it stops
      this.cc.setSlopeLimit(30, 60);

      //tell controller
      // - which animation range/ animation group should be used for which player animation
      // - rate at which to play that animation range
      // - wether the animation range should be looped
      //use this if name, rate or looping is different from default
      //set a parm to null if you donot want to change that

      this.cc.setIdleAnim(null, 1, true);
      this.cc.setTurnLeftAnim(null, 0.5, true);
      this.cc.setTurnRightAnim(null, 0.5, true);
      this.cc.setWalkAnim(agMap["walk2"], 1, true);
      this.cc.setWalkBackAnim(null, 0.5, true);
      this.cc.setIdleJumpAnim(null, 0.5, false);
      this.cc.setRunJumpAnim(null, 0.6, false);
      this.cc.setFallAnim(null, 2, false);
      this.cc.setSlideBackAnim(null, 1, false);

      //let's set footstep sound
      //this sound will be played for all actions except idle.
      //the sound will be played twice per cycle of the animation
      //the rate will be set automatically based on frames and fps of animation

      //set how smmothly should we transition from one animation to another
      this.cc.enableBlending(0.05);

      //if somehting comes between camera and avatar move camera in front of the obstruction?
      this.cc.setCameraElasticity(true);
      //if something comes between camera and avatar make the obstruction invisible?
      this.cc.makeObstructionInvisible(false);

      this.cc.start();

    });
  }
  
  async loadPlayerAsync() {
    const model = await SceneLoader.ImportMeshAsync(
      "",
      "./model/",
      "Vincent-frontFacing.glb",
      this.scene
  );

    var player = model.meshes[0];

    debugger

      //clean up this player mesh
      //it has camera and lights, lets remove them
      let m = model.meshes[0].getChildren();
      let l = m.length - 1;
      for (let i = l; i >= 0; i--) {
        if (m[i].name == "Camera" || m[i].name == "Hemi" || m[i].name == "Lamp") m[i].dispose();
      }

      player.position = new Vector3(0, 0, 0);
      player.checkCollisions = true;

      player.ellipsoid = new Vector3(0.5, 1, 0.5);
      player.ellipsoidOffset = new Vector3(0, 1, 0);

      // character controller  needs rotation in euler.
      // if your mesh has rotation in quaternion then convert that to euler.
      // NOTE: The GLTF/GLB files have rotation in quaternion
      player.rotation = player.rotationQuaternion!.toEulerAngles();
      player.rotationQuaternion = null;

      //rotate the camera behind the player
      //.glbs are RHS
      player.rotation.y = Math.PI / 4;
      var alpha = (3 * Math.PI) / 2 - player.rotation.y;
      var beta = Math.PI / 2.5;
      var target = new Vector3(player.position.x, player.position.y + 1.5, player.position.z);
      var camera = new ArcRotateCamera("ArcRotateCamera", alpha, beta, 5, target, this.scene);

      // make sure the keyboard keys controlling camera are different from those controlling player
      // here we will not use any keyboard keys to control camera
      camera.keysLeft = [];
      camera.keysRight = [];
      camera.keysUp = [];
      camera.keysDown = [];

      // below are all standard camera settings.
      // nothing specific to charcter controller
      camera.wheelPrecision = 15;
      camera.checkCollisions = false;
      // how close can the camera come to player
      camera.lowerRadiusLimit = 2;
      // how far can the camera go from the player
      camera.upperRadiusLimit = 20;
      camera.attachControl(this.canvas, false);

      // provide all your animation groups as a map to the character controller
      // the map should have
      // key = the name of the character controller  animation
      // and
      // value = the AnimationGroup corresponding to that animation.

      this.allAGs = this.scene.animationGroups;

      //stop all animations
      //also lets print to console the list of animation groups we have in this file, to help map them properly
      for (let i = 0; i < this.allAGs.length; i++) {
        this.allAGs[i].stop();
        console.log(i + "," + this.allAGs[i].name);
      }

      var agMap = this.createAGmap(this.allAGs);

      this.cc = new CharacterController(<Mesh>player, camera, this.scene, agMap, true);

      this.cc.setMode(0);
      //below makes the controller point the camera at the player head which is approx
      //1.5m above the player origin
      this.cc.setCameraTarget(new Vector3(0, 2, 0));

      //if the camera comes close to the player then we want this.cc to enter first person mode.
      this.cc.setNoFirstPerson(false);
      //the height of steps which the player can climb
      this.cc.setStepOffset(0.4);
      //the minimum and maximum slope the player can go up
      //between the two the player will start sliding down if it stops
      this.cc.setSlopeLimit(30, 60);

      //tell controller
      // - which animation range/ animation group should be used for which player animation
      // - rate at which to play that animation range
      // - wether the animation range should be looped
      //use this if name, rate or looping is different from default
      //set a parm to null if you donot want to change that

      this.cc.setIdleAnim(null, 1, true);
      this.cc.setTurnLeftAnim(null, 0.5, true);
      this.cc.setTurnRightAnim(null, 0.5, true);
      this.cc.setWalkAnim(agMap["walk2"], 1, true);
      this.cc.setWalkBackAnim(null, 0.5, true);
      this.cc.setIdleJumpAnim(null, 0.5, false);
      this.cc.setRunJumpAnim(null, 0.6, false);
      this.cc.setFallAnim(null, 2, false);
      this.cc.setSlideBackAnim(null, 1, false);

      //let's set footstep sound
      //this sound will be played for all actions except idle.
      //the sound will be played twice per cycle of the animation
      //the rate will be set automatically based on frames and fps of animation

      //set how smmothly should we transition from one animation to another
      this.cc.enableBlending(0.05);

      //if somehting comes between camera and avatar move camera in front of the obstruction?
      this.cc.setCameraElasticity(true);
      //if something comes between camera and avatar make the obstruction invisible?
      this.cc.makeObstructionInvisible(false);

      // this.cc.start();


  }

  createAGmap(allAGs) {
    //lets map ag groups to the character controller actions.
    let agMap = {
      idle: allAGs[0],
      strafeLeft: allAGs[3],
      strafeRight: allAGs[4],
      turnRight: allAGs[5],
      walk: allAGs[6],
      fall: allAGs[8],
      slideBack: allAGs[9],
      runJump: allAGs[10],
      turnLeft: allAGs[11],
      walkBack: allAGs[12],
      run: allAGs[13],
      idleJump: allAGs[14],
    };

    return agMap;
  }


}
