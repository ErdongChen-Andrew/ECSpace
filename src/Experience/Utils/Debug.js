import * as dat from "dat.gui";
import Stats from "three/examples/jsm/libs/stats.module";

export default class Debug {
  constructor() {
    this.active = window.location.hash === "#debug";
    this.stats = Stats();

    if (this.active) {
      this.ui = new dat.GUI();
      document.body.appendChild(this.stats.dom);
    }
  }

  update() {
    this.stats.update();
  }
}
