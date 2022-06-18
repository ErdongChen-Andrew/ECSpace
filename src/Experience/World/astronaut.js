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

    /**
     * Astonaut model setups
     */
    this.resource = this.resources.items.astronautModel;
    this.modelGroup = new THREE.Group();

    /**
     * Camera basic set up
     */
    const invisibleCubeGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const invisibleCubeMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
    });
    // Camera movement pre-setups
    this.camIdlePosition = new THREE.Mesh();
    this.camPosition = new THREE.Mesh();
    this.camPositionLookAt = new THREE.Mesh();
    // Camera pointers pre-setups
    this.camIdlePosition.geometry = invisibleCubeGeo;
    this.camIdlePosition.material = invisibleCubeMaterial;
    this.camPosition.geometry = invisibleCubeGeo;
    this.camPosition.material = invisibleCubeMaterial;
    this.camPositionLookAt.geometry = invisibleCubeGeo;
    this.camPositionLookAt.material = invisibleCubeMaterial;

    this.setModel();
    this.setCameraPosition();
    this.setAnimation();
  }

  setModel() {
    this.model = this.resource.scene;
    this.modelGroup.add(
      this.camIdlePosition,
      this.camPosition,
      this.camPositionLookAt,
      this.model
    );
    this.scene.add(this.modelGroup);

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

  setCameraPosition() {
    // set up idle cubes positions for idle cam position
    this.camIdlePosition.position.set(
      this.model.position.x + 2,
      this.model.position.y + 1,
      this.model.position.z + 7
    );
    // set up following invisible cubes positions
    this.camPosition.position.set(
      0,
      this.model.position.y + 7,
      this.model.position.z - 6
    );
    this.camPositionLookAt.position.set(
      this.model.position.x,
      this.model.position.y + 2.5,
      this.model.position.z
    );
  }

  hideAstronautModel() {
    if (this.model) {
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.transparent = true;
          child.material.opacity = 0;
        }
      });
    }
  }

  showAstronautModel() {
    if (this.model) {
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.opacity = 1;
        }
      });
    }
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
