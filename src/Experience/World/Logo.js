import * as THREE from "three";
import * as CANNON from "cannon-es";
import Experience from "../Experience";

export default class Logo {
  constructor(defaultMaterial, physicsWorld) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.defaultMaterial = defaultMaterial;
    this.physicsWorld = physicsWorld;
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
    this.setLogoPhysics();
  }

  setLogo() {
    this.logoTopModel = this.resources.items.logoTopModel.scene;
    this.logoBottomModel = this.resources.items.logoBottomModel.scene;
    this.logoModel = new THREE.Group();
    this.logoTopModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = this.logoMaterial;
        this.logoMaterial.matcap = this.logoTexture;
      }
    });
    this.logoBottomModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = this.logoMaterial;
        this.logoMaterial.matcap = this.logoTexture;
      }
    });
    this.logoModel.add(this.logoTopModel);
    this.logoModel.add(this.logoBottomModel);
    this.logoModel.rotation.y = Math.PI;
    this.logoModel.rotation.x = Math.PI / 2;
    this.logoModel.position.z = 18;

    this.scene.add(this.logoModel);
  }

  setLogoPhysics() {
    this.logoShape = new CANNON.Sphere(2);
    this.logoBody = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
    });
    this.logoBody.addShape(this.logoShape);
    this.physicsWorld.addBody(this.logoBody);
  }

  update(logoOffset) {
    const elapsedTime = this.clock.getElapsedTime();
    if (logoOffset < 6) {
      this.logoModel.position.z =
        0.5 * Math.sin(elapsedTime / 1.2) + 18 + (6 - logoOffset) / 1.8;
    } else {
      this.logoModel.position.z = 0.5 * Math.sin(elapsedTime / 1.2) + 18;
    }

    // Update logo body to follow logo model position
    this.logoBody.position.copy(this.logoModel.position);
    this.logoBody.quaternion.copy(this.logoModel.quaternion);
  }
}
