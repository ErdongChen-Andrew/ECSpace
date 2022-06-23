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
    this.setLogoBase();
    this.setLogoPhysics();
    this.setLogoBasePhysics();
  }

  setLogo() {
    this.logoTopModel = this.resources.items.logoTopModel.scene;
    this.logoBottomModel = this.resources.items.logoBottomModel.scene;
    this.logoTextModel = this.resources.items.logoTextModel.scene;
    this.twitterIconModel = this.resources.items.twitterIconModel.scene;
    this.githubIconModel = this.resources.items.githubIconModel.scene;
    this.linkedinIconModel = this.resources.items.linkedinIconModel.scene;
    this.emailIconModel = this.resources.items.emailIconModel.scene;
    this.iconsSet = [
      this.twitterIconModel,
      this.githubIconModel,
      this.linkedinIconModel,
      this.emailIconModel,
    ];

    this.logoModel = new THREE.Group();
    // Logo top setups
    this.logoTopModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = this.logoMaterial;
        this.logoMaterial.matcap = this.logoTexture;
      }
    });
    // Logo bottom setups
    this.logoBottomModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = this.logoMaterial;
        this.logoMaterial.matcap = this.logoTexture;
      }
    });
    // Logo text setups
    this.logoTextModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = this.logoMaterial;
        this.logoMaterial.matcap = this.logoTexture;
      }
    });
    this.logoTextModel.scale.set(0.1, 0.1, 0.1);

    // Each icon setups
    this.iconsSet.forEach((icon) => {
      icon.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = this.logoMaterial.clone();
          this.logoMaterial.matcap = this.logoTexture;
          child.material.side = THREE.DoubleSide;
          child.material.transparent = true;
          child.material.opacity = 0.6;
        }
      });
      icon.scale.set(0.1, 0.1, 0.1);
    });

    // At camera viewing position box
    this.logoCamPosition = new THREE.Mesh(
      new THREE.BoxGeometry(0.01, 0.01, 0.01),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
      })
    );
    this.logoCamPosition.position.z = 10;
    this.logoCamPosition.position.y = 1;

    this.logoModel.add(this.logoTopModel);
    this.logoModel.add(this.logoBottomModel);
    this.logoModel.add(this.logoTextModel);
    this.logoModel.add(this.twitterIconModel);
    this.logoModel.add(this.githubIconModel);
    this.logoModel.add(this.linkedinIconModel);
    this.logoModel.add(this.emailIconModel);
    this.logoModel.add(this.logoCamPosition);

    this.logoModel.rotation.y = Math.PI;
    this.logoModel.rotation.x = Math.PI / 2;
    this.logoModel.position.z = 18;

    this.scene.add(this.logoModel);
  }

  setLogoBase() {
    this.logoBaseModel = this.resources.items.logoBaseModel.scene;
    this.logoBaseModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = this.logoMaterial;
        this.logoMaterial.matcap = this.logoTexture;
      }
    });
    this.logoBaseModel.rotation.x = Math.PI / 2;
    this.logoBaseModel.position.z = 14.3;
    this.scene.add(this.logoBaseModel);
  }

  setLogoPhysics() {
    this.logoShape = new CANNON.Cylinder(2, 2, 1.5);
    this.logoBody = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
    });
    this.logoBody.position.y = 0.8;
    this.logoBody.addShape(this.logoShape);

    // Set up logo trigger body
    const logoTriggerShape = new CANNON.Cylinder(4.3, 4.3, 3);
    this.logoTriggerBody = new CANNON.Body({ isTrigger: true });
    this.logoTriggerBody.addShape(logoTriggerShape);
    this.logoTriggerBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      Math.PI / 2
    );
    this.logoTriggerBody.position.set(0, 0, 16);

    this.physicsWorld.addBody(this.logoBody);
    this.physicsWorld.addBody(this.logoTriggerBody);
  }

  setLogoBasePhysics() {
    this.logoBaseShape = new CANNON.Cylinder(2, 4, 1);
    this.logoBaseBody = new CANNON.Body({
      mass: 0,
      material: this.defaultMaterial,
      shape: this.logoBaseShape,
    });
    this.logoBaseBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      Math.PI / 2
    );
    this.logoBaseBody.position.z = 14.8;
    this.physicsWorld.addBody(this.logoBaseBody);
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
