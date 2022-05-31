import * as THREE from "three";
import Experience from "../Experience";

export default class Logo {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.clock = new THREE.Clock();

    // Logo materials and textures setup
    this.logoMaterial = new THREE.MeshMatcapMaterial();
    this.logoTextMaterial = new THREE.MeshMatcapMaterial();
    this.logoTexture = this.resources.items.logoMatcapTexture;
    this.logoTextTextture = this.resources.items.logoMatcapTexture;
    this.logoTexture.encoding = THREE.sRGBEncoding;
    this.logoTextTextture.encoding = THREE.sRGBEncoding;

    this.setLogo();
  }

  setLogo() {
    this.logoModel = this.resources.items.logoModel.scene;
    this.logoModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = this.logoMaterial;
        this.logoMaterial.matcap = this.logoTexture;
      }
    });
    this.logoModel.rotation.y = Math.PI;
    this.logoModel.rotation.x = Math.PI / 2;
    this.logoModel.position.z = 18;

    this.scene.add(this.logoModel);
  }

  update(logoOffset) {
    const elapsedTime = this.clock.getElapsedTime();
    if (logoOffset < 6) {
      this.logoModel.position.z =
        0.5 * Math.sin(elapsedTime / 1.2) + 18 + (6 - logoOffset)/1.8;
    } else {
      this.logoModel.position.z = 0.5 * Math.sin(elapsedTime / 1.2) + 18;
    }
  }
}
