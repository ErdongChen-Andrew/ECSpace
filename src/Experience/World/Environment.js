import * as THREE from "three";
import Experience from "../Experience";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    // Debug
    // if (this.debug.active) {
    //   this.debugFolder = this.debug.ui.addFolder("environment");
    // }

    // this.setLights();
    this.setEnvironmentMap();
  }

  setLights() {
    this.setAmbientLight = new THREE.AmbientLight(0xffffff, 1);

    this.setFrontSunLight = new THREE.DirectionalLight(0x1e2443, 3);
    this.setFrontSunLight.castShadow = true;
    this.setFrontSunLight.shadow.mapSize.set(1024, 1024);
    this.setFrontSunLight.shadow.camera.far = 250;
    this.setFrontSunLight.shadow.camera.left = -70;
    this.setFrontSunLight.shadow.camera.top = 70;
    this.setFrontSunLight.shadow.camera.right = 70;
    this.setFrontSunLight.shadow.camera.bottom = -70;
    this.setFrontSunLight.position.set(-100, 150, 100);
    this.setFrontSunLight.shadow.normalBias = 0.23;

    this.setBackSunLight = new THREE.DirectionalLight(0x94d2ff, 2);
    this.setBackSunLight.castShadow = true;
    this.setBackSunLight.shadow.mapSize.set(1024, 1024);
    this.setBackSunLight.shadow.camera.far = 250;
    this.setBackSunLight.shadow.camera.left = -70;
    this.setBackSunLight.shadow.camera.top = 70;
    this.setBackSunLight.shadow.camera.right = 70;
    this.setBackSunLight.shadow.camera.bottom = -70;
    this.setBackSunLight.position.set(-100, 100, -100);
    this.setBackSunLight.shadow.normalBias = 1.2;

    this.scene.add(
      this.setAmbientLight,
      this.setFrontSunLight,
      this.setBackSunLight
    );

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.setAmbientLight, "intensity")
        .min(0)
        .max(10)
        .step(0.001)
        .name("AmbientLight Intensity");
      this.debugFolder
        .add(this.setFrontSunLight.position, "x")
        .min(-1000)
        .max(1000)
        .step(0.001)
        .name("Front Light X");
      this.debugFolder
        .add(this.setFrontSunLight.position, "y")
        .min(-1000)
        .max(1000)
        .step(0.001)
        .name("Front Light Y");
      this.debugFolder
        .add(this.setFrontSunLight.position, "z")
        .min(-1000)
        .max(1000)
        .step(0.001)
        .name("Front Light Z");
      this.debugFolder
        .add(this.setFrontSunLight, "intensity")
        .min(0)
        .max(10)
        .step(0.001)
        .name("FrontLight Intensity");

      this.debugFolder
        .add(this.setBackSunLight.position, "x")
        .min(-1000)
        .max(1000)
        .step(0.001)
        .name("Back Light X");
      this.debugFolder
        .add(this.setBackSunLight.position, "y")
        .min(-1000)
        .max(1000)
        .step(0.001)
        .name("Back Light Y");
      this.debugFolder
        .add(this.setBackSunLight.position, "z")
        .min(-1000)
        .max(1000)
        .step(0.001)
        .name("Back Light Z");
      this.debugFolder
        .add(this.setBackSunLight, "intensity")
        .min(0)
        .max(10)
        .step(0.001)
        .name("BackLight Intensity");
    }
  }

  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.intensity = 70;
    this.environmentMap.texture = this.resources.items.environmentMapTexture;
    this.environmentMap.texture.encoding = THREE.sRGBEncoding;

    this.scene.environment = this.environmentMap.texture;
    this.scene.background = this.environmentMap.texture;



    // this.environmentMap.updateMaterials = () => {
    //   this.scene.traverse((child) => {
    //     if (
    //       child instanceof THREE.Mesh &&
    //       child.material instanceof THREE.MeshStandardMaterial
    //     ) {
    //       child.material.envMap = this.environmentMap.texture;
    //       child.material.envMapIntensity = this.environmentMap.intensity;
    //       child.material.needsUpdate = true;
    //     }
    //   });
    // };

    // this.environmentMap.updateMaterials();

    // Debug
    // if (this.debug.active) {
    //   this.debugFolder
    //     .add(this.environmentMap, "intensity")
    //     .name("envMapIntensity")
    //     .min(0)
    //     .max(100)
    //     .step(0.001)
    //     .onChange(this.environmentMap.updateMaterials);
    // }
  }
}
