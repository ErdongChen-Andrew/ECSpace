import * as THREE from "three";
import Experience from "./Experience";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.camera = this.experience.camera;
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("renderer");
    }

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
    this.instance.physicallyCorrectLights = true;
    this.instance.outputEncoding = THREE.sRGBEncoding;
    this.instance.toneMapping = THREE.LinearToneMapping;
    this.instance.toneMappingExposure = 1.2;
    this.instance.setClearColor(0x3b3b3b);

    // Render scene on to TV screen
    this.tvScreenRender = new THREE.WebGLRenderTarget(
      this.sizes.width,
      this.sizes.height,
      {
        encoding: THREE.sRGBEncoding,
        generateMipmaps: false,
        minFilter: THREE.NearestFilter,
      }
    );

    this.tvScene = new THREE.Scene();
    let allNeededObjects = [];

    // Selecte what needs to be shown on TV
    this.resources.on("ready", () => {
      // Set renderer color back to black
      this.instance.setClearColor(0x000000);
      this.scene.clone().children.forEach((item) => {
        if (item instanceof THREE.Points) {
          allNeededObjects.push(item);
        }
        item.children.forEach((items) => {
          if (
            items.name === "ice" ||
            items.name === "land" ||
            items.name === "miniplanet" ||
            (items instanceof THREE.Group && items.children[0].name === "rig")
          ) {
            allNeededObjects.push(items);
          }
        });
      });
      this.tvScene.add(...allNeededObjects);
    });

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.instance, "toneMapping", {
          No: THREE.NoToneMapping,
          Linear: THREE.LinearToneMapping,
          Reinhard: THREE.ReinhardToneMapping,
          Cineon: THREE.CineonToneMapping,
          ACESFilmic: THREE.ACESFilmicToneMapping,
        })
        .onFinishChange(() => {
          this.instance.toneMapping = Number(this.instance.toneMapping);
        });
      this.debugFolder
        .add(this.instance, "toneMappingExposure")
        .min(0)
        .max(10)
        .step(0.001);
    }
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    this.instance.setRenderTarget(this.tvScreenRender);
    this.instance.render(this.tvScene, this.camera.instance);
    this.instance.setRenderTarget(null);
    this.instance.render(this.scene, this.camera.instance);
  }
}
