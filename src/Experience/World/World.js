import * as CANNON from "cannon-es";
import * as THREE from "three";
import gsap from "gsap";
import CannonDebugger from "cannon-es-debugger";
import Experience from "../Experience";
import Environment from "./Environment";
import Planet from "./Planet";
import Astronaut from "./astronaut";
import SoccerGame from "./SoccerGame";
import RoomSet from "./RoomSet";
import Logo from "./Logo";
import ExplorerSet from "./ExplorerSet";
// import sources from "../sources";
import muteIcon from "../../../static/textures/muteIcon.png";
import unmuteIcon from "../../../static/textures/unmuteIcon.png";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.debugObejcts = {};
    this.camera = this.experience.camera;
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.time = this.experience.time;
    this.resources = this.experience.resources;
    this.emptyVec3 = new THREE.Vector3();
    this.emptyCannonVec3 = new CANNON.Vec3();
    this.origin = new THREE.Vector3(0, 0, 0);
    this.loadingProgress = document.querySelector("#loadingProgress");
    this.muteButtom = document.querySelector("#muteButtom");

    // Player controls pre-setups
    this.playerGroupXAxis = new THREE.Vector3();
    this.playerGroupYAxis = new THREE.Vector3();
    this.playerGroupZAxis = new THREE.Vector3();

    // spaceKeyDown is set to prevent jump multiple times when holding space key down
    this.spaceKeyDown = false;

    /**
     * Debug folder set up
     */
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("physics");
    }

    /**
     * Camera basic set up
     */
    this.camNewPosition = new THREE.Vector3();
    this.camNewPositionLookAt = new THREE.Vector3();
    this.camCurrentPosition = new THREE.Vector3();
    this.camCurrentPositionLookAt = new THREE.Vector3();

    /**
     * Physics setup
     */
    this.gForce = 0.1;
    this.debugObejcts.gForceScale = 90;
    this.physicsWorld = new CANNON.World();
    this.physicsWorld.allowSleep = true;
    this.physicsWorld.solver.iterations = 10;
    this.physicsWorld.gravity.set(0, -this.gForce, 0);
    this.keyMap = {};

    // Set physics contact materials
    this.defaultMaterial = new CANNON.Material("default");
    this.astronautMaterial = new CANNON.Material("astronaut");
    // Contact params between default and default
    this.defaultContactMaterial = new CANNON.ContactMaterial(
      this.defaultMaterial,
      this.defaultMaterial,
      {
        friction: 0.7,
        restitution: 0.5,
      }
    );
    // Contact params between astronaut and default
    this.astronautDefaultContactMaterial = new CANNON.ContactMaterial(
      this.astronautMaterial,
      this.defaultMaterial,
      {
        friction: 2,
        restitution: 0,
      }
    );
    this.physicsWorld.addContactMaterial(this.defaultContactMaterial);
    this.physicsWorld.addContactMaterial(this.astronautDefaultContactMaterial);

    // Set physics debugger
    if (this.debug.active) {
      this.debugger = new CannonDebugger(this.scene, this.physicsWorld, {
        onInit(body, mesh) {
          document.addEventListener("keydown", (event) => {
            if (event.key === "k") {
              mesh.visible = !mesh.visible;
            }
          });
        },
      });

      this.debugFolder
        .add(this.debugObejcts, "gForceScale")
        .name("gravity scale")
        .min(0)
        .max(700)
        .step(0.001);
    }

    /**
     * Basic setup after resources are loaded
     */
    this.resources.on("ready", () => {
      // Setups
      this.environment = new Environment();
      this.shadowMap = this.resources.items.shadowMap;
      this.upAxis = new CANNON.Vec3(0, 1, 0);
      this.gravityDirection = new CANNON.Vec3();

      // Astronaut setup
      this.astronaut = new Astronaut();
      this.astronautMesh = this.astronaut.modelGroup;
      this.astronautGravityDirection = new CANNON.Vec3();
      this.camIdlePosition = this.astronaut.camIdlePosition;
      this.camPosition = this.astronaut.camPosition;
      this.camPositionLookAt = this.astronaut.camPositionLookAt;

      /**
       * Logo Setups
       */
      this.astronautDistanceToLogo = null;
      this.logoSet = new Logo(this.defaultMaterial, this.physicsWorld);
      this.logoMesh = this.logoSet.logoModel;
      this.logoTopMesh = this.logoSet.logoTopModel;
      this.logoTextMesh = this.logoSet.logoTextModel;
      this.logoIconsSet = this.logoSet.iconsSet;
      this.logoTriggerBody = this.logoSet.logoTriggerBody;
      this.logoCamPosition = this.logoSet.logoCamPosition;
      this.logoCamLookAtPosition = new THREE.Vector3();
      this.logoFixedPosition = new THREE.Vector3(0, 0, 18);
      this.logoMeshSpherical = new THREE.Spherical();

      /**
       *  Planet Setups
       */
      this.planet = new Planet(this.defaultMaterial, this.physicsWorld);
      this.planetBody = this.planet.planetBody;
      this.planetRadius = this.planet.planetRadius;

      // Moon setup
      this.moonBody = this.planet.moonBody;

      /**
       *  Soccer game Setups
       */
      this.soccerGame = new SoccerGame(
        this.defaultMaterial,
        this.physicsWorld,
        this.applyRotation
      );

      // Soccer ball setups
      this.soccerBallBody = this.soccerGame.soccerBallBody;

      // Soccer goal setups
      this.soccerGoalBody = this.soccerGame.soccerGoalBody;

      // Grass set setups
      this.grassBodySet = this.soccerGame.grassBodySet;

      // Tree set setups
      this.treeBodySet = this.soccerGame.treeBodySet;

      /**
       *  Room Setups
       */
      this.roomSet = new RoomSet(
        this.defaultMaterial,
        this.physicsWorld,
        this.applyRotation
      );

      // Table setups
      this.tableBody = this.roomSet.tableBody;

      // Laptop setups
      this.laptopBody = this.roomSet.laptopBody;

      // Chair setups
      this.chairBody = this.roomSet.chairBody;

      // Speaker setups
      this.speakerBody = this.roomSet.speakerBody;

      // Picture frame setups
      this.picFrameBody = this.roomSet.picFrameBody;

      // Mug setups
      this.mugBody = this.roomSet.mugBody;

      // Telescope setups
      this.telescopeBody = this.roomSet.telescopeBody;

      // Sofa setups
      this.sofaBody = this.roomSet.sofaBody;
      this.sofaPillow001Body = this.roomSet.sofaPillow001Body;
      this.sofaPillow002Body = this.roomSet.sofaPillow002Body;

      // TV bench setups
      this.tvBenchBody = this.roomSet.tvBenchBody;

      // TV setups
      this.tvBody = this.roomSet.tvBody;

      // Switch setups
      this.switchBody = this.roomSet.switchBody;

      // Diffuser setups
      this.diffuserBody = this.roomSet.diffuserBody;

      // Shelf setups
      this.shelfBody = this.roomSet.shelfBody;
      this.shelfModel = this.roomSet.shelfGroup;
      this.projectsSet = this.roomSet.projectsSet;

      this.project001Position = new THREE.Vector3().copy(
        this.roomSet.projectsSet[0].children[0].position
      );
      this.project002Position = new THREE.Vector3().copy(
        this.roomSet.projectsSet[1].children[0].position
      );
      this.project003Position = new THREE.Vector3().copy(
        this.roomSet.projectsSet[2].children[0].position
      );
      this.project004Position = new THREE.Vector3().copy(
        this.roomSet.projectsSet[3].children[0].position
      );

      this.shelfTriggerBody = this.roomSet.shelfTriggerBody;
      this.shelfCamPosition = this.roomSet.shelfCamPosition;
      this.shelfBodySpherical = new THREE.Spherical();
      this.shelfXAxis = new THREE.Vector3();
      this.shelfYAxis = new THREE.Vector3();
      this.shelfZAxis = new THREE.Vector3();

      // Lego car setups
      this.legoBody = this.roomSet.legoBody;

      /**
       *  Explorer Setups
       */
      this.explorerSet = new ExplorerSet(
        this.defaultMaterial,
        this.physicsWorld
      );

      // Moon rover setups
      this.moonRoverBody = this.explorerSet.moonRoverBody;
      this.wheelLFBody = this.explorerSet.wheelLFBody;
      this.wheelRFBody = this.explorerSet.wheelRFBody;
      this.wheelLBBody = this.explorerSet.wheelLBBody;
      this.wheelRBBody = this.explorerSet.wheelRBBody;

      // Moon lander setups
      this.moonLanderBody = this.explorerSet.moonLanderBody;

      // Moon satellite setups
      this.moonSatelliteBody = this.explorerSet.moonSatelliteBody;

      // UFO setups
      this.ufoBody = this.explorerSet.ufoBody;
      this.ufoBody.angularDamping = 0.1;
      this.ufoModel = this.explorerSet.ufoGroup;
      this.ufoTriggerBody = this.explorerSet.ufoTriggerBody;
      this.ufoCamPosition = this.explorerSet.ufoCamPosition;
      this.ufoCamLookAtPosition = this.explorerSet.ufoCamLookAtPosition;
      this.ufoBodySpherical = new THREE.Spherical();
      // UFO control setups
      this.ufoXAxis = new THREE.Vector3();
      this.ufoYAxis = new THREE.Vector3();
      this.ufoZAxis = new THREE.Vector3();
      this.ufoPosXForce = new CANNON.Vec3(0.5, 0, 0);
      this.ufoPosYForce = new CANNON.Vec3(0, 0.5, 0);
      this.ufoNegXForce = new CANNON.Vec3(-0.5, 0, 0);
      this.ufoNegYForce = new CANNON.Vec3(0, -0.5, 0);
      this.ufoRightWing = new CANNON.Vec3(0, 0, 1);
      this.ufoLeftWing = new CANNON.Vec3(0, 0, -1);
      this.ufoHead = new CANNON.Vec3(1, 0, 0);
      this.ufoTail = new CANNON.Vec3(-1, 0, 0);

      /**
       * Indicator Setups
       */
      this.indicatorModel = this.resources.items.indicatorModel.scene;
      this.indicatorMaterial = new THREE.MeshBasicMaterial({
        color: "skyblue",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      });
      this.indicatorModel.children[0].material = this.indicatorMaterial;

      // Logo indicator setups
      this.logoIndicator = this.indicatorModel.clone();
      this.logoIndicator.children[0].material = this.indicatorMaterial.clone();
      this.logoIndicator.children[0].scale.set(4, 4, 0.5);
      this.astronautAtLogo = false;
      // UFO indicator setups
      this.ufoIndicator = this.indicatorModel.clone();
      this.ufoIndicator.children[0].material = this.indicatorMaterial.clone();
      this.ufoIndicator.children[0].scale.set(4, 4, 0.5);
      this.astronautAtUFO = false;
      // Projects shelf indicator setups
      this.projectsIndicator = this.indicatorModel.clone();
      this.projectsIndicator.children[0].material =
        this.indicatorMaterial.clone();
      this.projectsIndicator.children[0].scale.set(3.5, 3.5, 0.5);
      this.astronautAtShelf = false;
      this.ableToPressF = false;
      this.pressedF = false;

      this.scene.add(
        this.logoIndicator,
        this.ufoIndicator,
        this.projectsIndicator
      );

      /**
       * Mouse move and click setups
       */
      this.mouse = new THREE.Vector2();
      this.currentIntersect = null;
      this.currentIconIntersect = null;
      // Getting mouse move position
      window.addEventListener("mousemove", (e) => {
        this.mouse.x = (e.clientX / this.sizes.width) * 2 - 1;
        this.mouse.y = -(e.clientY / this.sizes.height) * 2 + 1;
      });
      // Mouse click event
      window.addEventListener("click", (e) => {
        // For project shelf
        if (this.currentIntersect) {
          // Detect which project is been click and open a new tab to that project website
          switch (this.currentIntersect.object.name) {
            case "projectPic":
            case "chrome":
              window
                .open("https://threejs-space-tourism.onrender.com/", "_blank")
                .focus();
              break;
            case "projectPic001":
            case "chrome001":
              window
                .open("https://threejs-minicyberpunk.vercel.app/", "_blank")
                .focus();
              break;
            case "projectPic002":
            case "chrome002":
              window
                .open(
                  "https://sketchfab.com/3d-models/sci-fi-corrido-polygon-runway-b08aa4d243bc43a083b6a8dcedb4d4a8",
                  "_blank"
                )
                .focus();
              break;
            case "projectPic003":
            case "chrome003":
              window
                .open(
                  "https://sketchfab.com/3d-models/tikishaman-polygon-runway-87fd863a5cc542f0a99d96fffb2dcf62",
                  "_blank"
                )
                .focus();
              break;
          }
        }

        // For logo icons
        if (this.currentIconIntersect) {
          // Detect which icon is been click and open a new tab to that website
          switch (this.currentIconIntersect.object.name) {
            case "twitterIcon":
              window.open("https://twitter.com/AndrewChenE", "_blank").focus();
              break;
            case "githubIcon":
              window
                .open("https://github.com/ErdongChen-Andrew", "_blank")
                .focus();
              break;
            case "linkedinIcon":
              window
                .open("https://www.linkedin.com/in/erdong-chen", "_blank")
                .focus();
              break;
            case "emailIcon":
              window.location.href =
                "mailto:erdong1993@gmail.com?subject=Hello%20World!";
              break;
          }
        }
      });

      /**
       * Raycaster
       */
      this.projectRaycaster = new THREE.Raycaster();
      this.iconRaycaster = new THREE.Raycaster();

      this.setBGMusic();
      this.logoIndicatorSetup();
      this.setAstronautPhysics();
      this.setPlayerControls();
      this.setIdleAnimationTimer();
      this.setCamera(this.loadingProgress);
      this.setFog();
      this.setHelpPage();

      this.shelfTriggerEvent();
      this.ufoTriggerEvent();
      this.logoTriggerEvent();
    });
  }

  /**
   * Background music setups
   */
  setBGMusic() {
    this.muted = true;
    let listener = null;

    // Toggole mute and unmute music
    this.muteButtom.addEventListener("click", () => {
      if (this.muted) {
        // Check if listener is already been created
        if (!listener) {
          // if no listener, create new one
          listener = new THREE.AudioListener();
          this.camera.instance.add(listener);
          this.bgMusic = new THREE.Audio(listener);
          this.audioLoader = new THREE.AudioLoader();
          // Load background music source
          this.audioLoader.load("/sound/slowmotion.mp3", (buffer) => {
            this.bgMusic.setBuffer(buffer);
            this.bgMusic.setLoop(true);
            this.bgMusic.setVolume(0.1);
            this.bgMusic.play();
          });
          this.muteButtom.src = unmuteIcon;
          this.muted = false;
        } else {
          // If there is a listener, play the audio
          this.bgMusic.play();
          this.muteButtom.src = unmuteIcon;
          this.muted = false;
        }
      } else if (!this.muted) {
        this.bgMusic.pause();
        this.muteButtom.src = muteIcon;
        this.muted = true;
      }
    });
  }

  /**
   * Update logo indicator to logo position
   */
  logoIndicatorSetup() {
    this.logoMeshSpherical.setFromVector3(this.logoMesh.position);
    this.logoIndicator.position.copy(
      this.emptyVec3.setFromSphericalCoords(
        this.planetRadius + 0.3,
        this.logoMeshSpherical.phi,
        this.logoMeshSpherical.theta
      )
    );
    // Upright the logo indicator
    this.logoIndicator.lookAt(this.origin);
  }

  /**
   * Crate a function to apply gravity force toward planet center
   */
  applyGForce(gForceDirection, bodyPosition, bodyForce, bodyMass) {
    gForceDirection.set(-bodyPosition.x, -bodyPosition.y, -bodyPosition.z);
    gForceDirection.normalize();
    gForceDirection.scale(
      this.debugObejcts.gForceScale * this.gForce,
      bodyForce
    );
    bodyForce.y += bodyMass * this.gForce;
    return bodyForce;
  }

  /**
   * Crate a function to apply rotation to bodies
   */
  applyRotation(xAngle, yAngle, zAngle) {
    // Set up three quats to correctly rotate object three times
    let quatX = new CANNON.Quaternion();
    let quatY = new CANNON.Quaternion();
    let quatZ = new CANNON.Quaternion();

    quatX.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), xAngle); // rotate around X axis
    quatY.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), yAngle); // rotate around Y axis
    quatZ.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), zAngle); // rotate around Z axis
    let finalQuat = quatX.mult(quatY).mult(quatZ);
    return finalQuat;
  }

  /**
   * Astronaut physics setup
   */
  setAstronautPhysics() {
    const astronautShape = new CANNON.Box(new CANNON.Vec3(0.75, 1, 0.75));
    const supportShape = new CANNON.Sphere(0.7);

    this.astronautBody = new CANNON.Body({
      mass: 1,
      material: this.astronautMaterial,
    });
    this.astronautBody.addShape(astronautShape);
    this.astronautBody.addShape(supportShape, new CANNON.Vec3(0, -0.7, 0));
    this.astronautBody.addShape(supportShape);
    this.astronautBody.addShape(supportShape, new CANNON.Vec3(0, 0.7, 0));
    this.astronautBody.position.set(0, this.planetRadius + 1.5, 0);
    this.astronautBody.allowSleep = false;
    this.physicsWorld.addBody(this.astronautBody);
    this.astronautCollide = false;
    this.contactNormal = new CANNON.Vec3();

    // Lock character from free rolling
    this.astronautBody.angularDamping = 1;

    // Detact if astronuat collide
    this.astronautBody.addEventListener("collide", (e) => {
      if (e.contact.bi.id == this.astronautBody.id) {
        // bi is the astronaut body, flip the contact normal
        e.contact.ni.negate(this.contactNormal);
      } else {
        // bi is something else. Keep the normal as it is
        this.contactNormal.copy(e.contact.ni);
      }
      // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
      if (this.contactNormal.dot(this.upAxis) > 0.5) {
        // Use a "good" threshold value between 0 and 1 here!
        this.astronautCollide = true;
      }
      // if the collide body is soccer ball
      if (e.contact.bi.id == this.soccerBallBody.id) {
        // When current soccer velocity is larger than current astronaut velocity,
        // kick the soccer back and play "run" animation once
        if (
          this.soccerBallBody.velocity.lengthSquared() >
          this.astronautBody.velocity.lengthSquared()
        ) {
          this.astronaut.animation.play("run");
          this.soccerBallBody.velocity =
            this.soccerBallBody.velocity.scale(-1.5);
        }
      }
    });
  }

  /**
   * Set up basic controls for controling the astronaut
   */
  setPlayerControls() {
    // setup
    this.forwardAxis = new THREE.Vector3(1, 0, 0);
    this.turnAxis = new THREE.Vector3(0, 1, 0);
    this.upRightAxis = new THREE.Vector3(0, 0, 1);
    this.oldPlayerPosition = new THREE.Vector3(0, 1, 0);
    this.newPlayerPosition = new THREE.Vector3();
    this.upRightAngle = 0;
    this.frontRightAngle = 0;
    this.angleBetweenPositions = 0;
    this.playerGroup = new THREE.Object3D();
    this.astronautBodySpherical = new THREE.Spherical();

    // control properties
    this.walkRad = 0.004;
    this.jumpHeight = new CANNON.Vec3(0, 4, 0);
    this.walkVelocity = new CANNON.Vec3(0, 0, 3.5);
    this.walkVelocityAndDir = new THREE.Vector3(0, 0, 0);
    this.backVelocityAndDir = new THREE.Vector3(0, 0, 0);
    this.jumpVelocityAndDir = new THREE.Vector3(0, 0, 0);

    // setup player control plate, also as the astronaut shadow
    this.playerPlate = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.5),
      new THREE.MeshBasicMaterial({
        // color: 0x333333,
        transparent: true,
        // alphaMap: this.shadowMap,
        opacity: 0,
      })
    );
    this.playerPlate.position.y = this.planetRadius + 0.05;
    this.playerPlate.rotation.x = -Math.PI / 2;
    this.playerPlate.renderOrder = 0.5;
    this.playerGroup.add(this.playerPlate);
    this.scene.add(this.playerGroup);

    // handle keymap events
    let jumpTimeout;
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && this.spaceKeyDown) {
        this.keyMap[e.code] = false;
      } else {
        this.keyMap[e.code] = e.type === "keydown";
      }
    });
    document.addEventListener("keyup", (e) => {
      if (e.code === "Space") {
        clearInterval(jumpTimeout);
        jumpTimeout = setTimeout(() => {
          this.keyMap[e.code] = e.type === "keydown";
          this.spaceKeyDown = false;
        }, 400);
      } else {
        this.keyMap[e.code] = e.type === "keydown";
      }
    });
    // pressed F trigger special event
    document.addEventListener("keypress", (e) => {
      if (this.ableToPressF) {
        if (e.code === "KeyF") {
          this.pressedF = !this.pressedF;
        }
      }
    });
  }

  /**
   * Detact if nothing moves on screen, then play different idle animation
   */
  setIdleAnimationTimer() {
    if (!this.pressedF) {
      let countTime;
      this.playIdleAnimation = false;

      const resetCountTime = () => {
        this.playIdleAnimation = false;
        clearTimeout(countTime);
        countTime = setTimeout(() => {
          this.playIdleAnimation = true;
        }, 60000);
      };

      window.onload = resetCountTime;
      document.onmousemove = resetCountTime;
      document.onkeydown = resetCountTime;
    }
  }

  /**
   * Setup camera initial position, and initial look at position
   */
  setCamera(loadingProgress) {
    // Initial position
    this.camCurrentPosition.set(-0.7, 17.1, 0.6);
    this.camCurrentPositionLookAt.set(0, 17.4, 0.2);

    // Moving to position
    setTimeout(() => {
      gsap.to(this.camCurrentPosition, { x: -5, y: 18, z: 5, duration: 1 });
      gsap.to(this.camCurrentPosition, { x: 5, y: 18, z: 5, duration: 1 });
    }, 1500);

    this.camera.instance.position.copy(this.camCurrentPosition);
    this.camera.instance.lookAt(this.camCurrentPositionLookAt);
    this.scene.add(this.camera.instance);
  }

  /**
   * Set up space fog
   */
  setFog() {
    const color = 0x333;
    const near = 50;
    const far = 500;
    this.scene.fog = new THREE.Fog(color, near, far);
  }

  /**
   * Set up help page
   */
  setHelpPage() {
    this.helpButton = document.querySelector("#helpButtom");
    this.helpButtonIsTouched = false;
    const helpPageTexture = this.resources.items.helpPageTexture;
    helpPageTexture.encoding = THREE.sRGBEncoding;
    helpPageTexture.generateMipmaps = false;

    // Get camera look at direction
    this.cameraLookAtVec = new THREE.Vector3();

    // Help page setups
    const helpPageMaterial = new THREE.SpriteMaterial({
      map: helpPageTexture,
      transparent: true,
      opacity: 0,
    });
    this.helpPage = new THREE.Sprite(helpPageMaterial);
    this.helpPage.scale.set(1.3, 0.66);
    this.scene.add(this.helpPage);

    // Detect if help button is been touched
    this.helpButton.addEventListener("touchstart", () => {
      this.helpButtonIsTouched = true;
    });
    this.helpButton.addEventListener("touchend", () => {
      this.helpButtonIsTouched = false;
    });
  }
  // Update help page location
  updateHelpPageLocation() {
    // Update camera look at direction for help page
    this.camera.instance.getWorldDirection(this.cameraLookAtVec);

    // Update help page and help buttom position
    this.helpPage.position.addVectors(
      this.camera.instance.position,
      this.cameraLookAtVec
    );
  }

  /**
   * Rest the logo to origin status
   */
  resetLogo() {
    // Change cursor back to normal
    document.body.style.cursor = "default";
    gsap.to(this.logoTopMesh.position, {
      duration: 1,
      y: 0,
    });
    gsap.to(this.logoTextMesh.scale, {
      duration: 0.7,
      x: 0.1,
      y: 0.1,
      z: 0.1,
    });
    this.logoIconsSet.forEach((icon) => {
      gsap.to(icon.scale, {
        duration: 0.7,
        x: 0.1,
        y: 0.1,
        z: 0.1,
      });
    });
  }

  /**
   * Rest the shelf to origin status
   */
  resetProjectShelf(currentIntersect) {
    if (currentIntersect) {
      // Change cursor back to normal
      document.body.style.cursor = "default";
      if (currentIntersect.object.name === "projectPic") {
        gsap.to(currentIntersect.object.parent.scale, {
          duration: 0.5,
          x: 1,
          y: 1,
        });
        gsap.to(currentIntersect.object.parent.position, {
          duration: 0.5,
          x: this.project001Position.x,
          y: this.project001Position.y,
          z: this.project001Position.z,
        });
      } else if (currentIntersect.object.name === "chrome") {
        gsap.to(currentIntersect.object.scale, {
          duration: 0.5,
          x: 1,
          y: 1,
        });
        gsap.to(currentIntersect.object.position, {
          duration: 0.5,
          x: this.project001Position.x,
          y: this.project001Position.y,
          z: this.project001Position.z,
        });
      } else if (currentIntersect.object.name === "projectPic001") {
        gsap.to(currentIntersect.object.parent.scale, {
          duration: 0.5,
          x: 1,
          y: 1,
        });
        gsap.to(currentIntersect.object.parent.position, {
          duration: 0.5,
          x: this.project002Position.x,
          y: this.project002Position.y,
          z: this.project002Position.z,
        });
      } else if (currentIntersect.object.name === "chrome001") {
        gsap.to(currentIntersect.object.scale, {
          duration: 0.5,
          x: 1,
          y: 1,
        });
        gsap.to(currentIntersect.object.position, {
          duration: 0.5,
          x: this.project002Position.x,
          y: this.project002Position.y,
          z: this.project002Position.z,
        });
      } else if (this.currentIntersect.object.name === "projectPic002") {
        gsap.to(this.currentIntersect.object.parent.scale, {
          duration: 0.5,
          x: 1,
          y: 1,
        });
        gsap.to(this.currentIntersect.object.parent.position, {
          duration: 0.5,
          x: this.project003Position.x,
          y: this.project003Position.y,
          z: this.project003Position.z,
        });
      } else if (currentIntersect.object.name === "chrome002") {
        gsap.to(currentIntersect.object.scale, {
          duration: 0.5,
          x: 1,
          y: 1,
        });
        gsap.to(currentIntersect.object.position, {
          duration: 0.5,
          x: this.project003Position.x,
          y: this.project003Position.y,
          z: this.project003Position.z,
        });
      } else if (currentIntersect.object.name === "projectPic003") {
        gsap.to(currentIntersect.object.parent.scale, {
          duration: 0.5,
          x: 1,
          y: 1,
        });
        gsap.to(currentIntersect.object.parent.position, {
          duration: 0.5,
          x: this.project004Position.x,
          y: this.project004Position.y,
          z: this.project004Position.z,
        });
      } else if (currentIntersect.object.name === "chrome003") {
        gsap.to(currentIntersect.object.scale, {
          duration: 0.5,
          x: 1,
          y: 1,
        });
        gsap.to(currentIntersect.object.position, {
          duration: 0.5,
          x: this.project004Position.x,
          y: this.project004Position.y,
          z: this.project004Position.z,
        });
      }
    }
  }

  /**
   * Set up trigger event when player enter / leave shelf area
   */
  shelfTriggerEvent() {
    // Trigger event when player close to shelf
    this.shelfTriggerBody.addEventListener("collide", (e) => {
      if (e.body === this.astronautBody) {
        this.astronautAtShelf = true;
        this.ableToPressF = true;
      }
    });
    this.physicsWorld.addEventListener("endContact", (e) => {
      if (
        (e.bodyA === this.astronautBody && e.bodyB === this.shelfTriggerBody) ||
        (e.bodyB === this.astronautBody && e.bodyA === this.shelfTriggerBody)
      ) {
        this.astronautAtShelf = false;
        this.ableToPressF = false;
      }
    });
  }

  /**
   * Set up trigger event when player enter / leave UFO area
   */
  ufoTriggerEvent() {
    // Trigger event when player close to UFO
    this.ufoTriggerBody.addEventListener("collide", (e) => {
      if (e.body === this.astronautBody) {
        this.astronautAtUFO = true;
        this.ableToPressF = true;
      }
    });
    this.physicsWorld.addEventListener("endContact", (e) => {
      if (
        (e.bodyA === this.astronautBody && e.bodyB === this.ufoTriggerBody) ||
        (e.bodyB === this.astronautBody && e.bodyA === this.ufoTriggerBody)
      ) {
        this.astronautAtUFO = false;
        this.ableToPressF = false;
      }
    });
  }

  /**
   * Set up trigger event when player enter / leave logo area
   */
  logoTriggerEvent() {
    // Trigger event when player close to logo
    this.logoTriggerBody.addEventListener("collide", (e) => {
      if (e.body === this.astronautBody) {
        this.astronautAtLogo = true;
        this.ableToPressF = true;
      }
    });
    this.physicsWorld.addEventListener("endContact", (e) => {
      if (
        (e.bodyA === this.astronautBody && e.bodyB === this.logoTriggerBody) ||
        (e.bodyB === this.astronautBody && e.bodyA === this.logoTriggerBody)
      ) {
        this.astronautAtLogo = false;
        this.ableToPressF = false;
      }
    });
  }

  /**
   * Animation setup
   */
  update() {
    // Update physics world
    this.physicsWorld.step(1 / 60, this.time.delta / 1000, 3);

    // Access help page
    if (this.helpPage) {
      if (this.keyMap["KeyH"] || this.helpButtonIsTouched) {
        gsap.to(this.helpPage.material, {
          duration: 0.5,
          opacity: 0.95,
        });
        gsap.to(this.helpPage.scale, {
          duration: 0.5,
          x: 1.3,
          y: 0.66,
        });
      } else if (!this.keyMap["KeyH"] && !this.helpButtonIsTouched) {
        gsap.to(this.helpPage.material, {
          duration: 0.5,
          opacity: 0,
        });
        gsap.to(this.helpPage.scale, {
          duration: 0.5,
          x: 0.8,
          y: 0.4,
        });
      }
    }

    // Detect if indicator rigs are over laping, if so block others
    if (this.astronautAtLogo && this.astronautAtShelf) {
      this.astronautAtShelf = false;
    } else if (this.astronautAtLogo && this.astronautAtUFO) {
      this.astronautAtUFO = false;
    } else if (
      this.astronautAtLogo &&
      this.astronautAtUFO &&
      this.astronautAtShelf
    ) {
      this.astronautAtUFO = false;
      this.astronautAtShelf = false;
    } else if (this.astronautAtUFO && this.astronautAtShelf) {
      this.astronautAtShelf = false;
    }

    // Logo update
    if (this.logoSet) {
      this.logoSet.update(this.astronautDistanceToLogo);
      if (this.astronautMesh) {
        this.astronautDistanceToLogo = this.astronautMesh.position.distanceTo(
          this.logoFixedPosition
        );
      }

      // If player is near logo, show the indicator
      if (this.logoMesh.position.distanceTo(this.astronautMesh.position) > 8) {
        if (this.logoIndicator.children[0].material.opacity > 0) {
          // Change render order of indicators and player shadow to prevent transparent overlapping
          this.logoIndicator.children[0].renderOrder = 0.5;
          this.logoIndicator.children[0].material.opacity -= 0.05;
        }
      } else {
        if (this.logoIndicator.children[0].material.opacity < 0.5) {
          // Change render order of indicators and player shadow to prevent transparent overlapping
          this.logoIndicator.children[0].renderOrder = 0;
          this.logoIndicator.children[0].material.opacity += 0.05;
        }
      }
    }

    // Dust mesh update
    if (this.planet) {
      this.planet.update();

      // Apply center gravity to moon
      this.moonBody.force = this.applyGForce(
        this.gravityDirection,
        this.moonBody.position,
        this.moonBody.force,
        this.moonBody.mass
      );
    }

    // Explorer set update
    if (this.explorerSet) {
      this.explorerSet.update();

      // Apply center gravity to moon rover
      this.moonRoverBody.force = this.applyGForce(
        this.gravityDirection,
        this.moonRoverBody.position,
        this.moonRoverBody.force,
        this.moonRoverBody.mass
      );
      this.wheelLFBody.force = this.applyGForce(
        this.gravityDirection,
        this.wheelLFBody.position,
        this.wheelLFBody.force,
        this.wheelLFBody.mass
      );
      this.wheelRFBody.force = this.applyGForce(
        this.gravityDirection,
        this.wheelRFBody.position,
        this.wheelRFBody.force,
        this.wheelRFBody.mass
      );
      this.wheelLBBody.force = this.applyGForce(
        this.gravityDirection,
        this.wheelLBBody.position,
        this.wheelLBBody.force,
        this.wheelLBBody.mass
      );
      this.wheelRBBody.force = this.applyGForce(
        this.gravityDirection,
        this.wheelRBBody.position,
        this.wheelRBBody.force,
        this.wheelRBBody.mass
      );

      // Apply center gravity to moon lander
      this.moonLanderBody.force = this.applyGForce(
        this.gravityDirection,
        this.moonLanderBody.position,
        this.moonLanderBody.force,
        this.moonLanderBody.mass
      );

      // Apply movement to moon satellite
      this.moonSatelliteBody.position.y =
        Math.sin(this.time.elapsed / 1000) + 30;

      // Apply center gravity to UFO
      this.ufoBody.force = this.applyGForce(
        this.gravityDirection,
        this.ufoBody.position,
        this.ufoBody.force,
        this.ufoBody.mass
      );
      // Update ufo indicator to follow the ufo
      this.ufoBodySpherical.setFromVector3(this.ufoBody.position);
      this.ufoIndicator.position.copy(
        this.emptyVec3.setFromSphericalCoords(
          this.ufoBody.position.distanceTo(this.origin),
          this.ufoBodySpherical.phi,
          this.ufoBodySpherical.theta
        )
      );
      // Upright the indicator
      this.ufoIndicator.lookAt(this.origin);

      // If player is near ufo, show the indicator
      if (this.ufoBody.position.distanceTo(this.astronautMesh.position) > 8) {
        if (this.ufoIndicator.children[0].material.opacity > 0) {
          this.ufoIndicator.children[0].material.opacity -= 0.05;
        }
      } else {
        if (this.ufoIndicator.children[0].material.opacity < 0.5) {
          this.ufoIndicator.children[0].material.opacity += 0.05;
        }
      }
    }

    // Soccer game update
    if (this.soccerGame) {
      this.soccerGame.update();

      //Apply center gravity to soccer ball
      this.soccerBallBody.force = this.applyGForce(
        this.gravityDirection,
        this.soccerBallBody.position,
        this.soccerBallBody.force,
        this.soccerBallBody.mass
      );

      //Apply center gravity to soccer goal
      this.soccerGoalBody.force = this.applyGForce(
        this.gravityDirection,
        this.soccerGoalBody.position,
        this.soccerGoalBody.force,
        this.soccerGoalBody.mass
      );

      //Apply center gravity to grass set
      this.grassBodySet.forEach((item) => {
        item.force = this.applyGForce(
          this.gravityDirection,
          item.position,
          item.force,
          item.mass
        );
      });

      //Apply center gravity to tree set
      this.treeBodySet.forEach((item) => {
        item.force = this.applyGForce(
          this.gravityDirection,
          item.position,
          item.force,
          item.mass
        );
      });
    }

    // Room set update
    if (this.roomSet) {
      this.roomSet.update();

      //Apply center gravity to table
      this.tableBody.force = this.applyGForce(
        this.gravityDirection,
        this.tableBody.position,
        this.tableBody.force,
        this.tableBody.mass
      );

      //Apply center gravity to laptop
      this.laptopBody.force = this.applyGForce(
        this.gravityDirection,
        this.laptopBody.position,
        this.laptopBody.force,
        this.laptopBody.mass
      );

      //Apply center gravity to chair
      this.chairBody.force = this.applyGForce(
        this.gravityDirection,
        this.chairBody.position,
        this.chairBody.force,
        this.chairBody.mass
      );

      //Apply center gravity to speakeer
      this.speakerBody.force = this.applyGForce(
        this.gravityDirection,
        this.speakerBody.position,
        this.speakerBody.force,
        this.speakerBody.mass
      );

      //Apply center gravity to speakeer
      this.picFrameBody.force = this.applyGForce(
        this.gravityDirection,
        this.picFrameBody.position,
        this.picFrameBody.force,
        this.picFrameBody.mass
      );

      //Apply center gravity to mug
      this.mugBody.force = this.applyGForce(
        this.gravityDirection,
        this.mugBody.position,
        this.mugBody.force,
        this.mugBody.mass
      );

      //Apply center gravity to telescope
      this.telescopeBody.force = this.applyGForce(
        this.gravityDirection,
        this.telescopeBody.position,
        this.telescopeBody.force,
        this.telescopeBody.mass
      );

      //Apply center gravity to sofa
      this.sofaBody.force = this.applyGForce(
        this.gravityDirection,
        this.sofaBody.position,
        this.sofaBody.force,
        this.sofaBody.mass
      );

      //Apply center gravity to sofa pillow 001
      this.sofaPillow001Body.force = this.applyGForce(
        this.gravityDirection,
        this.sofaPillow001Body.position,
        this.sofaPillow001Body.force,
        this.sofaPillow001Body.mass
      );

      //Apply center gravity to sofa pillow 002
      this.sofaPillow002Body.force = this.applyGForce(
        this.gravityDirection,
        this.sofaPillow002Body.position,
        this.sofaPillow002Body.force,
        this.sofaPillow002Body.mass
      );

      //Apply center gravity to TV bench
      this.tvBenchBody.force = this.applyGForce(
        this.gravityDirection,
        this.tvBenchBody.position,
        this.tvBenchBody.force,
        this.tvBenchBody.mass
      );

      //Apply center gravity to TV
      this.tvBody.force = this.applyGForce(
        this.gravityDirection,
        this.tvBody.position,
        this.tvBody.force,
        this.tvBody.mass
      );

      //Apply center gravity to switch
      this.switchBody.force = this.applyGForce(
        this.gravityDirection,
        this.switchBody.position,
        this.switchBody.force,
        this.switchBody.mass
      );

      //Apply center gravity to diffuser
      this.diffuserBody.force = this.applyGForce(
        this.gravityDirection,
        this.diffuserBody.position,
        this.diffuserBody.force,
        this.diffuserBody.mass
      );

      //Apply center gravity to shelf
      this.shelfBody.force = this.applyGForce(
        this.gravityDirection,
        this.shelfBody.position,
        this.shelfBody.force,
        this.shelfBody.mass
      );

      //Apply center gravity to lego car
      this.legoBody.force = this.applyGForce(
        this.gravityDirection,
        this.legoBody.position,
        this.legoBody.force,
        this.legoBody.mass
      );

      /**
       * Shelf indicator setups
       */
      // Update projects indicator to follow the shelf
      this.shelfBodySpherical.setFromVector3(this.shelfBody.position);
      this.projectsIndicator.position.copy(
        this.emptyVec3.setFromSphericalCoords(
          this.planetRadius + 0.3,
          this.shelfBodySpherical.phi,
          this.shelfBodySpherical.theta
        )
      );
      // Upright the indicator
      this.projectsIndicator.lookAt(this.origin);
      // Get shelf model X,Y,Z local axises
      this.shelfModel.matrix.extractBasis(
        this.shelfXAxis,
        this.shelfYAxis,
        this.shelfZAxis
      );
      // If shelf stand up right and player near the shelf, show the indicator
      if (
        this.shelfYAxis.angleTo(this.shelfModel.position) > 1 ||
        this.shelfModel.position.distanceTo(this.astronautMesh.position) > 8
      ) {
        if (this.projectsIndicator.children[0].material.opacity > 0) {
          // Change render order of indicators and player shadow to prevent transparent overlapping
          this.projectsIndicator.children[0].renderOrder = 0.5;
          this.projectsIndicator.children[0].material.opacity -= 0.05;
        }
      } else {
        if (this.projectsIndicator.children[0].material.opacity < 0.5) {
          // Change render order of indicators and player shadow to prevent transparent overlapping
          this.projectsIndicator.children[0].renderOrder = 0;
          this.projectsIndicator.children[0].material.opacity += 0.05;
        }
      }
    }

    // Update astronaut physics
    if (this.astronaut) {
      this.astronaut.update();
      // Apply center gravity to astronaut
      this.astronautBody.force = this.applyGForce(
        this.astronautGravityDirection,
        this.astronautBody.position,
        this.astronautBody.force,
        this.astronautBody.mass
      );

      // Fadeout astronaut shadow according to it's jump height
      // this.playerPlate.material.opacity =
      //   1 - (this.astronautToOrigin - this.planetRadius) * 0.3;

      // Update jump up axis
      this.upAxis.copy(this.astronautGravityDirection.scale(-1));

      // Update astronaut position and quaternion to follow playerPlate
      this.astronautBody.quaternion.copy(this.playerGroup.quaternion);

      // Astronaut distance to world origin
      this.astronautToOrigin = Math.sqrt(
        this.astronautBody.position.x * this.astronautBody.position.x +
          this.astronautBody.position.y * this.astronautBody.position.y +
          this.astronautBody.position.z * this.astronautBody.position.z
      );

      // Match astronaut mash to follow physic body
      this.astronautMesh.position.copy(this.astronautBody.position);
      this.astronautMesh.quaternion.copy(this.astronautBody.quaternion);

      // Astronut movement controls
      // Update forward, backward and jump velocity and direction
      this.astronautBody.quaternion.vmult(
        this.walkVelocity.scale(1),
        this.walkVelocityAndDir
      );
      this.astronautBody.quaternion.vmult(
        this.walkVelocity.scale(-0.5),
        this.backVelocityAndDir
      );
      this.astronautBody.quaternion.vmult(
        this.jumpHeight.scale(1.2),
        this.jumpVelocityAndDir
      );

      // Moving forward
      if (!this.pressedF) {
        if (this.keyMap["KeyW"]) {
          if (this.astronautBody.velocity.length() > 3.5) {
            this.astronautBody.velocity.copy(this.astronautBody.velocity);
          } else {
            this.astronautBody.velocity.copy(this.walkVelocityAndDir);
          }
          // update camera position when move forward
          this.camCurrentPosition.lerp(
            this.camNewPosition,
            this.time.delta / 500
          );
          this.camCurrentPositionLookAt.lerp(
            this.camNewPositionLookAt,
            this.time.delta / 500
          );

          this.camera.instance.position.copy(this.camCurrentPosition);
          this.camera.instance.lookAt(this.camCurrentPositionLookAt);
          if (!this.keyMap["Space"]) {
            this.astronaut.animation.play("run");
          }
        }
        // Moving backward
        if (this.keyMap["KeyS"]) {
          if (this.astronautBody.velocity.length() > 1.75) {
            this.astronautBody.velocity.copy(this.astronautBody.velocity);
          } else {
            this.astronautBody.velocity.copy(this.backVelocityAndDir);
          }
          if (!this.keyMap["Space"] && !this.keyMap["KeyW"]) {
            this.astronaut.animation.play("walk");
          }
        }
        // Turning left
        if (this.keyMap["KeyA"]) {
          this.playerGroup.rotateOnAxis(this.turnAxis, this.walkRad * 6);
          if (!this.keyMap["Space"] && !this.keyMap["KeyW"]) {
            this.astronaut.animation.play("walk");
          }
        }
        // Turning right
        if (this.keyMap["KeyD"]) {
          this.playerGroup.rotateOnAxis(this.turnAxis, -this.walkRad * 6);
          if (!this.keyMap["Space"] && !this.keyMap["KeyW"]) {
            this.astronaut.animation.play("walk");
          }
        }
        // Jumping event
        if (
          this.keyMap["Space"] &&
          this.astronautCollide &&
          !this.spaceKeyDown
        ) {
          this.astronautBody.velocity.vadd(
            this.jumpVelocityAndDir,
            this.astronautBody.velocity
          );

          this.astronaut.animation.play("jump");

          // Set astronaut collide back to false and space key down back to true
          this.astronautCollide = false;
          this.spaceKeyDown = true;
        } else if (
          !this.keyMap["KeyW"] &&
          !this.keyMap["KeyS"] &&
          !this.keyMap["KeyA"] &&
          !this.keyMap["KeyD"] &&
          !this.keyMap["Space"]
        ) {
          if (!this.playIdleAnimation && this.astronaut) {
            this.astronaut.animation.play("idle2");
          }
          // Play idle animation when nothing moves on screen
          else if (this.playIdleAnimation && this.astronaut) {
            this.camCurrentPosition.lerp(
              this.camIdlePosition.getWorldPosition(this.emptyVec3),
              this.time.delta / 500
            );
            this.camCurrentPositionLookAt.lerp(
              this.astronautBody.position,
              this.time.delta / 500
            );
            // Camera movement
            this.camera.instance.position.copy(this.camCurrentPosition);
            this.camera.instance.lookAt(this.camCurrentPositionLookAt);
            this.astronaut.animation.play("idle1");
          }
        }
      }

      /**
       * PlayerPlate follow astronautBody
       */
      // Get current position of austronaut body
      this.newPlayerPosition.copy(this.astronautGravityDirection.scale(-1));
      this.angleBetweenPositions = this.newPlayerPosition.angleTo(
        this.oldPlayerPosition
      );

      if (this.angleBetweenPositions > 0) {
        // If there is any position changes, get axises of playerGroup for latter update
        this.playerGroup.getWorldDirection(this.playerGroupZAxis);
        this.playerGroupYAxis
          .copy(this.playerGroup.up)
          .applyMatrix4(this.playerGroup.matrix)
          .normalize();
        this.playerGroupXAxis.crossVectors(
          this.playerGroupZAxis,
          this.playerGroupYAxis
        );

        this.upRightAngle =
          Math.PI / 2 - this.newPlayerPosition.angleTo(this.playerGroupXAxis);
        this.frontRightAngle =
          Math.PI / 2 - this.newPlayerPosition.angleTo(this.playerGroupZAxis);

        this.playerGroup.rotateOnAxis(this.upRightAxis, this.upRightAngle);
        this.playerGroup.rotateOnAxis(this.forwardAxis, this.frontRightAngle);

        this.oldPlayerPosition.copy(this.newPlayerPosition);
      }
    }

    // Show/Hide physics wireframes
    if (this.debug.active) {
      this.debugger.update();
      this.debug.update();
    }

    /**
     * Camera update
     */
    // Update camera to follow astronaut position
    if (this.astronaut && !this.pressedF) {
      this.camNewPosition.copy(
        this.camPosition.getWorldPosition(this.emptyVec3)
      );
      this.camNewPositionLookAt.copy(
        this.camPositionLookAt.getWorldPosition(this.emptyVec3)
      );
      this.camera.instance.up.copy(this.astronautGravityDirection.scale(-1));

      // Camera auto follow astronaut when it is in the high sky
      if (this.astronautBody.position.distanceTo(this.origin) > 22) {
        this.camCurrentPosition.lerp(this.camNewPosition, this.time.delta / 16);
        this.camCurrentPositionLookAt.lerp(
          this.camNewPositionLookAt,
          this.time.delta / 16
        );
        this.camera.instance.position.copy(this.camCurrentPosition);
        this.camera.instance.lookAt(this.camCurrentPositionLookAt);
      }

      // Update help page location
      this.updateHelpPageLocation();
    }

    /**
     * Project shelf visiting event
     */
    // If shelf lies down, stop all shelf event
    if (
      this.projectsIndicator &&
      this.projectsIndicator.children[0].material.opacity < 0 &&
      this.astronautAtShelf
    ) {
      this.astronautAtShelf = false;
      this.ableToPressF = false;
    }
    // Trigger event when palyer is at shelf area and pressed F
    if (
      this.astronautAtShelf &&
      this.pressedF &&
      this.projectsIndicator.children[0].material.opacity > 0
    ) {
      // Update help page location
      this.updateHelpPageLocation();

      // Create raycaster alone current camera position and mouse position
      this.projectRaycaster.setFromCamera(this.mouse, this.camera.instance);
      const intersects = this.projectRaycaster.intersectObjects(
        this.projectsSet
      );

      // Add hovering obejct to an array
      if (intersects.length) {
        if (!this.currentIntersect) {
          // Change cursor back to pointer
          document.body.style.cursor = "pointer";
          // Detect if hovering on project picture
          if (
            intersects[0].object.name === "projectPic" ||
            intersects[0].object.name === "projectPic001" ||
            intersects[0].object.name === "projectPic002" ||
            intersects[0].object.name === "projectPic003"
          ) {
            this.currentIntersect = intersects[0];
            // Scale up hovering object and zoom it toward to camera
            gsap.to(this.currentIntersect.object.parent.position, {
              duration: 0.4,
              x: 0,
              y: 0.2,
              z: -2,
            });
            gsap.to(this.currentIntersect.object.parent.scale, {
              duration: 0.4,
              x: 2.65,
              y: 2.5,
            });
          }
          // Detect if hovering on project frame
          else if (
            intersects[0].object.name === "chrome" ||
            intersects[0].object.name === "chrome001" ||
            intersects[0].object.name === "chrome002" ||
            intersects[0].object.name === "chrome003"
          ) {
            this.currentIntersect = intersects[0];
            // Scale up hovering object and zoom it toward to camera
            gsap.to(this.currentIntersect.object.position, {
              duration: 0.4,
              x: 0,
              y: 0.2,
              z: -2,
            });
            gsap.to(this.currentIntersect.object.scale, {
              duration: 0.4,
              x: 2.65,
              y: 2.5,
            });
          }
        }
      } else {
        // Move back the project box when mouse is leaving
        this.resetProjectShelf(this.currentIntersect);
        this.currentIntersect = null;
      }

      // Move camera focus on the shelf if player at the shelf and pressed F
      this.camera.instance.position.lerp(
        this.shelfCamPosition.getWorldPosition(this.emptyVec3),
        this.time.delta / 300
      );
      this.camera.instance.lookAt(this.shelfModel.position);
      this.camera.instance.up.copy(this.shelfYAxis);
      // Hide astronaut shadow
      // this.playerPlate.material.opacity = 0;
    }

    /**
     * UFO driving event
     */
    // Trigger event when palyer is at UFO area and pressed F
    else if (this.astronautAtUFO && this.pressedF) {
      // Get each axis fdor ufo body
      this.ufoModel.matrix.extractBasis(
        this.ufoXAxis,
        this.ufoYAxis,
        this.ufoZAxis
      );
      // Move camera focus on the ufo if player at the ufo and pressed F
      this.camera.instance.position.copy(
        this.ufoCamPosition.getWorldPosition(this.emptyVec3)
        // this.time.delta / 160
      );
      this.camera.instance.lookAt(
        this.ufoCamLookAtPosition.getWorldPosition(this.emptyVec3)
      );
      this.camera.instance.up.copy(this.ufoYAxis);
      // Hide indicator ring
      if (this.ufoIndicator.children[0].material.opacity > 0) {
        this.ufoIndicator.children[0].material.opacity -= 0.1;
      }
      // Update help page location
      this.updateHelpPageLocation();
      // Hide astronaut shadow
      // this.playerPlate.material.opacity = 0;
      // Move astronaut body to the top of UFO
      this.astronautBody.position.copy(
        this.ufoCamLookAtPosition.getWorldPosition(this.emptyVec3)
      );

      /**
       * UFO movement control
       */
      // UFO take off and set gravity to 0
      this.ufoBody.applyForce(this.ufoYAxis);
      this.ufoBody.force.set(0, 0, 0);
      // Move forward
      if (this.keyMap["KeyW"]) {
        this.ufoBody.velocity.set(
          4 * this.ufoXAxis.x,
          4 * this.ufoXAxis.y,
          4 * this.ufoXAxis.z
        );
      }
      // Move backward
      if (this.keyMap["KeyS"]) {
        this.ufoBody.velocity.set(
          -2 * this.ufoXAxis.x,
          -2 * this.ufoXAxis.y,
          -2 * this.ufoXAxis.z
        );
      }
      // Move upward
      if (this.keyMap["KeyV"]) {
        this.ufoBody.velocity.set(
          2 * this.ufoYAxis.x,
          2 * this.ufoYAxis.y,
          2 * this.ufoYAxis.z
        );
      }
      // Move downward
      if (this.keyMap["Space"]) {
        this.ufoBody.velocity.set(
          -2 * this.ufoYAxis.x,
          -2 * this.ufoYAxis.y,
          -2 * this.ufoYAxis.z
        );
      }
      // Turning left
      if (this.keyMap["KeyA"]) {
        this.ufoBody.applyLocalForce(this.ufoPosXForce, this.ufoRightWing);
        this.ufoBody.applyLocalForce(this.ufoNegXForce, this.ufoLeftWing);
      }
      // Turning right
      if (this.keyMap["KeyD"]) {
        this.ufoBody.applyLocalForce(this.ufoPosXForce, this.ufoLeftWing);
        this.ufoBody.applyLocalForce(this.ufoNegXForce, this.ufoRightWing);
      }
      // Rolling counterclockwise
      if (this.keyMap["ArrowLeft"]) {
        this.ufoBody.applyLocalForce(this.ufoPosYForce, this.ufoRightWing);
        this.ufoBody.applyLocalForce(this.ufoNegYForce, this.ufoLeftWing);
      }
      // Rolling clockwise
      if (this.keyMap["ArrowRight"]) {
        this.ufoBody.applyLocalForce(this.ufoPosYForce, this.ufoLeftWing);
        this.ufoBody.applyLocalForce(this.ufoNegYForce, this.ufoRightWing);
      }
      // Rolling forward
      if (this.keyMap["ArrowUp"]) {
        this.ufoBody.applyLocalForce(this.ufoPosYForce, this.ufoTail);
        this.ufoBody.applyLocalForce(this.ufoNegYForce, this.ufoHead);
      }
      // Rolling backward
      if (this.keyMap["ArrowDown"]) {
        this.ufoBody.applyLocalForce(this.ufoPosYForce, this.ufoHead);
        this.ufoBody.applyLocalForce(this.ufoNegYForce, this.ufoTail);
      }
    }

    /**
     * Logo trigger event
     */
    // Trigger event when palyer is at logo area and pressed F
    else if (this.astronautAtLogo && this.pressedF) {
      // Update help page location
      this.updateHelpPageLocation();

      // Move camera focus on the logo if player at the logo and pressed F
      this.camera.instance.position.lerp(
        this.logoCamPosition.getWorldPosition(this.emptyVec3),
        this.time.delta / 800
      );
      this.logoCamLookAtPosition.set(
        this.logoMesh.position.x,
        this.logoMesh.position.y,
        this.logoMesh.position.z + 2.5
      );
      this.camera.instance.lookAt(this.logoCamLookAtPosition);
      this.camera.instance.up.copy(this.logoIndicator.position);

      // Show logo text and icons
      gsap.to(this.logoTopMesh.position, {
        duration: 0.7,
        y: 4,
      });
      gsap.to(this.logoTextMesh.scale, {
        duration: 1,
        x: 1,
        y: 1,
        z: 1,
      });
      this.logoIconsSet.forEach((icon) => {
        gsap.to(icon.scale, {
          duration: 0.7,
          x: 1,
          y: 1,
          z: 1,
        });
      });

      // Create raycaster alone current camera position and mouse position
      this.iconRaycaster.setFromCamera(this.mouse, this.camera.instance);
      const intersects = this.iconRaycaster.intersectObjects(this.logoIconsSet);

      // Add hovering obejct to an array
      if (intersects.length) {
        if (!this.currentIconIntersect) {
          this.currentIconIntersect = intersects[0];
          // Change cursor to pointer
          document.body.style.cursor = "pointer";
          // Scale up hovering object
          gsap.to(this.currentIconIntersect.object.scale, {
            duration: 0.4,
            x: 120,
            y: 120,
            z: 120,
          });
        }
      } else {
        // Scale down the project box when mouse is leaving
        if (this.currentIconIntersect) {
          gsap.to(this.currentIconIntersect.object.scale, {
            duration: 0.4,
            x: 100,
            y: 100,
            z: 100,
          });
          this.currentIconIntersect = null;
        }

        // Change cursor back to default
        document.body.style.cursor = "default";
      }
    } else if (
      /**
       * Reset camera if none of event triggers
       */
      (this.astronaut && !this.pressedF) ||
      this.astronautAtShelf === false ||
      this.astronautAtLogo === false ||
      this.astronautAtUFO === false
    ) {
      // move camera back to original position if player pressed F again
      this.camera.instance.position.lerp(
        this.camCurrentPosition,
        this.time.delta / 300
      );
      this.camera.instance.lookAt(this.camCurrentPositionLookAt);
      this.camera.instance.up.copy(this.astronautGravityDirection.scale(-1));
      // Move back the project box when mouse is leaving
      this.resetProjectShelf(this.currentIntersect);
      this.currentIntersect = null;
      // Reset logo status
      this.resetLogo();
      this.currentIconIntersect = null;
    }

    /**
     * Hide / Show astronaut mesh and body when any trigger event happened
     */
    if (
      (this.astronautAtShelf &&
        this.pressedF &&
        this.projectsIndicator.children[0].material.opacity > 0) ||
      (this.astronautAtUFO && this.pressedF) ||
      (this.astronautAtLogo && this.pressedF)
    ) {
      this.astronaut.hideAstronautModel();
      this.physicsWorld.removeBody(this.astronautBody);
    } else if (
      (this.astronaut && !this.pressedF) ||
      this.astronautAtShelf === false ||
      this.astronautAtLogo === false ||
      this.astronautAtUFO === false
    ) {
      this.pressedF = false;
      this.astronaut.showAstronautModel();
      this.physicsWorld.addBody(this.astronautBody);
    }
  }
}
