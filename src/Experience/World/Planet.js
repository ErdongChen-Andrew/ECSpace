import * as THREE from "three";
import * as CANNON from "cannon-es";
import Experience from "../Experience";
import dustVertex from "../Shaders/dustVertex";
import dustFragment from "../Shaders/dustFragment";

export default class Planet {
  constructor(defaultMaterial, physicsWorld) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.clock = new THREE.Clock();
    this.defaultMaterial = defaultMaterial;
    this.physicsWorld = physicsWorld;
    this.upAxis = new CANNON.Vec3(0, 1, 0);
    this.planetRadius = 15;
    this.moonInitialVelocity = 28;
    this.moonDistance = 130;
    this.miniPlanetSet = [];

    // Debug
    this.debugObjects = {};
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("dust particles");
    }

    // Main planet model and physics
    this.setPlanet();
    this.setPlanetPhysics();

    // Moon model and physics
    this.setMoon();
    this.setMoonPhysics();

    // Dust mesh
    this.setDust();

    // Mini Planets mesh
    this.setMiniPlanet();

    // Air walls physics
    this.setBoarderPhysics()
  }

  /**
   * ThreeJS set up
   */
  setPlanet() {
    const planetSurfaceTextures = this.resources.items.planetMatcapTexture;
    const planetLandTextures = this.resources.items.planetLandMatcapTexture;
    planetSurfaceTextures.encoding = THREE.sRGBEncoding;
    planetLandTextures.encoding = THREE.sRGBEncoding;

    this.planetModel = this.resources.items.planetModel.scene;
    this.planetModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "ice") {
          child.material = new THREE.MeshMatcapMaterial({
            matcap: planetSurfaceTextures,
            transparent: true,
            opacity: 0.95,
          });
        }
        if (child.name === "land" || child.name === "land001") {
          child.material = new THREE.MeshMatcapMaterial({
            matcap: planetLandTextures,
          });
        }
      }
    });
    this.scene.add(this.planetModel);
  }

  setMoon() {
    const moonTextures = this.resources.items.moonMatcapTexture;
    moonTextures.encoding = THREE.sRGBEncoding;
    const moonGeometry = new THREE.SphereGeometry(3, 20, 20);
    const material = new THREE.MeshMatcapMaterial({
      matcap: moonTextures,
    });
    this.moonMesh = new THREE.Mesh(moonGeometry, material);
    this.scene.add(this.moonMesh);
  }

  setDust() {
    const dustNumber = 1000;
    const positionArray = new Float32Array(dustNumber * 3);
    const scaleArray = new Float32Array(dustNumber);

    // set ramdon position for each dust
    for (let i = 0; i < dustNumber; i++) {
      positionArray[i * 3] = (Math.random() - 0.5) * 300;
      positionArray[i * 3 + 1] = (Math.random() - 0.5) * 300;
      positionArray[i * 3 + 2] = (Math.random() - 0.5) * 300;
      scaleArray[i] = Math.random();
    }

    // set dust geometry to buffer geometery
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
    );
    dustGeometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(scaleArray, 1)
    );

    // set dust material
    const dustMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 3000 },
        uTime: { value: 0 },
      },
      vertexShader: dustVertex,
      fragmentShader: dustFragment,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.dustMesh = new THREE.Points(dustGeometry, dustMaterial);
    this.scene.add(this.dustMesh);

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.dustMesh.material.uniforms.uSize, "value")
        .name("size")
        .min(0)
        .max(5000)
        .step(0.001);
    }
  }

  setMiniPlanet() {
    let miniPlanetSize;
    let miniPlanetPositiion = new THREE.Spherical();

    const miniPlanetSurfaceTextures = [
      this.resources.items.miniPlanetMatcapTexture001,
      this.resources.items.miniPlanetMatcapTexture002,
      this.resources.items.miniPlanetMatcapTexture003,
      this.resources.items.miniPlanetMatcapTexture004,
      this.resources.items.miniPlanetMatcapTexture005,
      this.resources.items.miniPlanetMatcapTexture006,
      this.resources.items.miniPlanetMatcapTexture007,
      this.resources.items.miniPlanetMatcapTexture008,
      this.resources.items.miniPlanetMatcapTexture009,
      this.resources.items.miniPlanetMatcapTexture010,
      this.resources.items.miniPlanetMatcapTexture011,
      this.resources.items.miniPlanetMatcapTexture012,
    ];
    miniPlanetSurfaceTextures.forEach((item) => {
      item.encoding = THREE.sRGBEncoding;
    });

    for (let i = 0; i < 24; i++) {
      miniPlanetSize = Math.max(1.5, 2 * Math.random());
      miniPlanetPositiion.set(
        Math.max(300, 500 * Math.random()),
        Math.PI * 2 * Math.random(),
        Math.PI * 2 * Math.random()
      );

      this.miniPlanetSet[i] =
        this.resources.items.miniPlanetModel.scene.clone();
      this.miniPlanetSet[i].traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshMatcapMaterial({
            matcap: miniPlanetSurfaceTextures[i > 11 ? i - 12 : i],
          });
          child.scale.set(miniPlanetSize, miniPlanetSize, miniPlanetSize);
        }
      });
      this.miniPlanetSet[i].position.setFromSpherical(miniPlanetPositiion);
      this.scene.add(this.miniPlanetSet[i]);
    }
  }

  /**
   * Physics setup
   */
  // Main planet physics setup
  setPlanetPhysics() {
    const planetShape = new CANNON.Sphere(this.planetRadius);
    const planetLandShape = new CANNON.Cylinder(7, 5, 3);

    this.planetBody = new CANNON.Body({
      shape: planetShape,
      material: this.defaultMaterial,
    });

    this.planetBody.addShape(planetLandShape, new CANNON.Vec3(0, -14.3, 0));

    this.physicsWorld.addBody(this.planetBody);
  }

  // Moon physics setup
  setMoonPhysics() {
    const moonShape = new CANNON.Sphere(3);
    this.moonBody = new CANNON.Body({
      mass: 1,
      shape: moonShape,
      material: this.defaultMaterial,
    });

    this.moonBody.position.set(this.moonDistance, 0, this.moonDistance);

    this.physicsWorld.addBody(this.moonBody);

    // Apply initial velocity
    this.moonBody.velocity = new CANNON.Vec3(0, this.moonInitialVelocity, 0);
  }

  // Create invisible outside boarders physics
  setBoarderPhysics() {
    const boarderShape1 = new CANNON.Box(new CANNON.Vec3(150, 1, 150));
    const boarderShape2 = new CANNON.Box(new CANNON.Vec3(150, 150, 1));
    const boarderShape3 = new CANNON.Box(new CANNON.Vec3(1, 150, 150));

    const boarderBody = new CANNON.Body({ mass: 0 });

    boarderBody.addShape(boarderShape1, new CANNON.Vec3(0, 150, 0));
    boarderBody.addShape(boarderShape1, new CANNON.Vec3(0, -150, 0));
    boarderBody.addShape(boarderShape2, new CANNON.Vec3(0, 0, 150));
    boarderBody.addShape(boarderShape2, new CANNON.Vec3(0, 0, -150));
    boarderBody.addShape(boarderShape3, new CANNON.Vec3(150, 0, 0));
    boarderBody.addShape(boarderShape3, new CANNON.Vec3(-150, 0, 0));

    this.physicsWorld.addBody(boarderBody);
  }

  resize() {
    this.dustMesh.material.uniforms.uPixelRatio.value = Math.min(
      window.devicePixelRatio,
      2
    );
  }

  update() {
    const elapsedTime = this.clock.getElapsedTime();
    this.dustMesh.material.uniforms.uTime.value = elapsedTime;

    /**
     * Moon physics update
     */
    this.moonMesh.position.copy(this.moonBody.position);
    this.moonMesh.quaternion.copy(this.moonBody.quaternion);

    this.miniPlanetSet.forEach((item) => {
      item.rotation.x = ((elapsedTime / 10) * item.position.z) / 100;
      item.rotation.y = ((elapsedTime / 10) * item.position.x) / 100;
      item.rotation.z = ((elapsedTime / 10) * item.position.y) / 100;
    });
  }
}
