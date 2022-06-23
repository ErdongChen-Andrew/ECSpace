import * as THREE from "three";
import EventEmitter from "./EventEmitter";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Resource extends EventEmitter {
  constructor(sources) {
    super();

    // Options
    this.sources = sources;

    // Setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.loadingManager = new THREE.LoadingManager(
      // Loaded
      ()=>{
        console.log("loaded");
      },

      // Progress
      (itemUrl, itemsLoaded, itemsTotal)=>{
        console.log(Math.round(itemsLoaded / itemsTotal*100));
      }
    )
    this.loaders.gltfLoader = new GLTFLoader(this.loaders.loadingManager);
    this.loaders.textureLoader = new THREE.TextureLoader(this.loaders.loadingManager);
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader(this.loaders.loadingManager);
  }

  startLoading() {
    // Load each source
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(source.path, (file) => {
          this.sourceLoaded(source,file);
        });
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source,file);
        });
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(source.path, (file) => {
          this.sourceLoaded(source,file);
        });
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;
    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
