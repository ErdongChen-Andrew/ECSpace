import * as THREE from "three";
import * as CANNON from "cannon-es";
import Experience from "../Experience";
import dustVertex from "../Shaders/dustVertex";
import dustFragment from "../Shaders/dustFragment";

export default class Planet {
  constructor(defaultContactMaterial, physicsWorld) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.clock = new THREE.Clock();
    this.defaultContactMaterial = defaultContactMaterial;
    this.physicsWorld = physicsWorld;
    this.upAxis = new CANNON.Vec3(0, 1, 0);
    this.planetRadius = 15;
    this.miniPlanetSet = [];

    // Debug
    this.debugObjects = {};
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("dust particles");
    }

    this.setPlanet();
    this.setMoon();
    this.setDust();
    this.setMiniPlanet();
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
        Math.max(300, 400 * Math.random()),
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

  resize() {
    this.dustMesh.material.uniforms.uPixelRatio.value = Math.min(
      window.devicePixelRatio,
      2
    );
  }

  update() {
    const elapsedTime = this.clock.getElapsedTime();
    this.dustMesh.material.uniforms.uTime.value = elapsedTime;

    this.miniPlanetSet.forEach((item) => {
      item.rotation.x = ((elapsedTime / 10) * item.position.z) / 100;
      item.rotation.y = ((elapsedTime / 10) * item.position.x) / 100;
      item.rotation.z = ((elapsedTime / 10) * item.position.y) / 100;
    });
  }
}
