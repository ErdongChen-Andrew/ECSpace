import * as THREE from "three";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import LoadingOverlay from "./World/LoadingOverlay";
import World from "./World/World";
import Resource from "./Utils/Resources";
import Debug from "./Utils/Debug";
import sources from "./sources.js";

let instance = null;

export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance;
    }
    instance = this;

    // Global access
    window.experience = this;

    // Options
    this.canvas = canvas;

    // Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resource(sources);
    this.camera = new Camera();
    this.loadingOverlay = new LoadingOverlay();
    this.world = new World();
    this.renderer = new Renderer();

    // Sizes resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });

    // Creator
    this.creator =
      "Creator: Erdong Chen (Andrew) @ Richmond, British Columbia, Canada. Contact info: erdong1993@gmail.com";
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
    this.world.planet.resize();
  }

  update() {
    // this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");

    // Traverse the whole scene
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];

          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    if (this.debug.active) {
      this.debug.ui.destroy();
    }
  }
}
