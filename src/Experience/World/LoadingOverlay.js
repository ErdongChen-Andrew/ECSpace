import * as THREE from "three";
import Experience from "../Experience";
import gsap from "gsap";

export default class LoadingOverlay {
  constructor() {
    // Setups
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.loadingImage = document.querySelector("#loadingImage");

    /**
     * Overlay setups
     */
    const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    const overlayMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uAlpha: { value: 100 },
      },
      vertexShader: `
            void main()
            {
                gl_Position = vec4(position, 1.0);
            }
        `,
      fragmentShader: `
            uniform float uAlpha;

            void main()
            {
                gl_FragColor = vec4(0.23, 0.23, 0.23, uAlpha);
            }
        `,
    });
    this.overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
    this.overlay.position.y = 18;
    this.scene.add(this.overlay);

    /**
     * Setups after resources are loaded
     */
    this.resources.on("ready", () => {
      gsap.to("#loadingImage", { duration: 0.8, opacity: 0 });
      gsap.to("#loadingProgress", { duration: 0.8, opacity: 0 });
      gsap.to(this.overlay.material.uniforms.uAlpha, {
        duration: 1,
        value: 0,
      });
      setTimeout(() => {
        gsap.to("#helpButtom", { duration: 1.5, opacity: 1 });
        gsap.to("#muteButtom", { duration: 1.5, opacity: 1 });
        this.scene.remove(this.overlay);
        this.loadingImage.remove();
      }, 1500);
    });
  }
}
