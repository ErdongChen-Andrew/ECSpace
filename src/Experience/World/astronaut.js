import * as THREE from "three";
import Experience from "../Experience";

export default class Astronaut {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.envMaptexture = this.resources.items.environmentMapTexture;
    this.envMapIntensity = 70;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.bodyMaterial = new THREE.MeshMatcapMaterial();
    this.trimMaterial = new THREE.MeshMatcapMaterial();
    this.redMaterial = new THREE.MeshMatcapMaterial();
    this.blueMaterial = new THREE.MeshMatcapMaterial();

    this.bodyMatcapTexture = this.resources.items.astronautBodyMatcapTexture;
    this.trimMatcapTexture = this.resources.items.astronautTrimMatcapTexture;
    this.redMatcapTexture = this.resources.items.astronautRedMatcapTexture;
    this.blueMatcapTexture =
      this.resources.items.astronautBlueLightMatcapTexture;

    // Setup
    this.resource = this.resources.items.astronautModel;

    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = this.resource.scene;
    this.scene.add(this.model);

    this.model.traverse((child) => {
      child.frustumCulled = false;
      if (child instanceof THREE.Mesh) {
        if (
          child.material.name === "helmet" ||
          child.material.name === "helmet.001"
        ) {
          child.material = this.bodyMaterial;
          this.bodyMaterial.matcap = this.bodyMatcapTexture;
          this.bodyMaterial.matcap.encoding = THREE.sRGBEncoding;
        }
        if (
          child.material.name === "silver" ||
          child.material.name === "silver.001"
        ) {
          child.material = this.trimMaterial;
          this.trimMaterial.matcap = this.trimMatcapTexture;
          this.trimMaterial.matcap.encoding = THREE.sRGBEncoding;
        }
        if (
          child.material.name === "red" ||
          child.material.name === "red.001"
        ) {
          child.material = this.redMaterial;
          this.redMaterial.matcap = this.redMatcapTexture;
          this.redMaterial.matcap.encoding = THREE.sRGBEncoding;
        }
        if (child.material.name === "blueLight") {
          child.material = this.blueMaterial;
          this.blueMaterial.matcap = this.blueMatcapTexture;
          this.blueMaterial.matcap.encoding = THREE.sRGBEncoding;
        }
        if (child.material.name === "mask") {
          child.material.envMap = this.envMaptexture;
          child.material.envMapIntensity = this.envMapIntensity;
        }
      }
    });
  }

  setAnimation() {
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.model);
    this.animation.actions = {};
    this.animation.actions.idle1 = this.animation.mixer.clipAction(
      this.resource.animations[0]
    );
    this.animation.actions.idle2 = this.animation.mixer.clipAction(
      this.resource.animations[1]
    );
    this.animation.actions.idle3 = this.animation.mixer.clipAction(
      this.resource.animations[2]
    );
    this.animation.actions.run = this.animation.mixer.clipAction(
      this.resource.animations[4]
    );
    this.animation.actions.walk = this.animation.mixer.clipAction(
      this.resource.animations[6]
    );
    this.animation.actions.jump = this.animation.mixer.clipAction(
      this.resource.animations[3]
    );
    this.animation.actions.jump.timeScale = 1.5;
    this.animation.actions.jump.repetitions = 1;

    this.animation.actions.current = this.animation.actions.idle2;
    this.animation.actions.current.play();

    this.animation.play = (name) => {
      const newAction = this.animation.actions[name];
      const oldAction = this.animation.actions.current;

      if (newAction !== oldAction) {
        newAction.reset();
        newAction.play();
        newAction.crossFadeFrom(oldAction, 0.3);
      }

      this.animation.actions.current = newAction;
    };
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.001);
  }
}
