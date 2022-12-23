import "./style.css";
import Experience from "./Experience/Experience";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import * as dat from "lil-gui";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const canvas = document.querySelector("canvas.webgl");
const experience = new Experience(canvas);

if (window.innerWidth < window.innerHeight) {
  alert(
    "Please rotate your device 🔄.\n**Note: this page requires a keyboard to control."
  );
}
