import * as THREE from "three";
import Experience from "../Experience";
import gsap from "gsap";

export default class LoadingOverlay {
  constructor() {
    // Setups
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;

    /**
     * Overlay setups
     */
    const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    const overlayMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uAlpha: { value: 100.0 },
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
    this.scene.add(this.overlay);

    /**
     * Setups after resources are loaded
     */
    this.resources.on("ready", () => {
      gsap.to("#loadingImage", { duration: 1, opacity: 0 });
      gsap.to("#loadingProgress", { duration: 1, opacity: 0 });
      gsap.to(this.overlay.material.uniforms.uAlpha, {
        duration: 1.2,
        value: 0,
      });
      setTimeout(() => {
        gsap.to("#helpButtom", { duration: 1.5, opacity: 1 });
      }, 1000);
    });
  }
}
