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

export default class World {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.debugObejcts = {};
    this.camera = this.experience.camera;
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.resources = this.experience.resources;
    this.emptyVec3 = new THREE.Vector3();
    this.emptyCannonVec3 = new CANNON.Vec3();
    this.origin = new THREE.Vector3(0, 0, 0);

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
    const invisibleCubeGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const invisibleCubeMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
    });
    // Camera movement pre-setups
    this.camIdlePosition = new THREE.Mesh();
    this.camPosition = new THREE.Mesh();
    this.camPositionLookAt = new THREE.Mesh();
    this.camNewPosition = new THREE.Vector3();
    this.camNewPositionLookAt = new THREE.Vector3();
    this.camCurrentPosition = new THREE.Vector3();
    this.camCurrentPositionLookAt = new THREE.Vector3();
    // Camera pointers pre-setups
    this.camIdlePosition.geometry = invisibleCubeGeo;
    this.camIdlePosition.material = invisibleCubeMaterial;
    this.camPosition.geometry = invisibleCubeGeo;
    this.camPosition.material = invisibleCubeMaterial;
    this.camPositionLookAt.geometry = invisibleCubeGeo;
    this.camPositionLookAt.material = invisibleCubeMaterial;

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
            if (event.key === "h") {
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
      this.astronautMesh = this.astronaut.model;
      this.astronautGravityDirection = new CANNON.Vec3();

      /**
       * Logo Setups
       */
      this.astronautDistanceToLogo = null;
      this.logoSet = new Logo(this.defaultMaterial, this.physicsWorld);
      this.logoMesh = this.logoSet.logoModel;
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
      this.shelfTriggerBody = this.roomSet.shelfTriggerBody;
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
      this.ufoBodySpherical = new THREE.Spherical();

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
      // UFO indicator setups
      this.ufoIndicator = this.indicatorModel.clone();
      this.ufoIndicator.children[0].material = this.indicatorMaterial.clone();
      this.ufoIndicator.children[0].scale.set(4, 4, 0.5);
      // Projects shelf indicator setups
      this.projectsIndicator = this.indicatorModel.clone();
      this.projectsIndicator.children[0].material =
        this.indicatorMaterial.clone();
      this.projectsIndicator.children[0].scale.set(3.5, 3.5, 0.5);

      this.scene.add(
        this.logoIndicator,
        this.ufoIndicator,
        this.projectsIndicator
      );

      this.logoIndicatorSetup();
      this.setAstronautPhysics();
      this.setPlayerControls();
      this.setIdleAnimationTimer();
      this.setCamera();
      this.setFog();

      this.shelfTriggerEvent();
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
        color: 0x333333,
        transparent: true,
        alphaMap: this.shadowMap,
      })
    );
    this.playerPlate.position.y = this.planetRadius;
    this.playerPlate.rotation.x = -Math.PI / 2;
    this.playerGroup.add(this.playerPlate);

    // set up idle cubes positions for idle cam position
    this.camIdlePosition.position.set(
      this.playerPlate.position.x + 2,
      this.playerPlate.position.y + 2,
      this.playerPlate.position.z + 8
    );
    // set up following invisible cubes positions
    this.camPosition.position.set(
      0,
      this.playerPlate.position.y + 9,
      this.playerPlate.position.z - 6
    );
    this.camPositionLookAt.position.set(
      this.playerPlate.position.x,
      this.playerPlate.position.y + 4.5,
      this.playerPlate.position.z
    );
    // adding invisible cubes for latter setting up cam position, camera will lerp to camPosition.position and look at camPositionLookAt.position
    this.playerGroup.add(
      this.camIdlePosition,
      this.camPosition,
      this.camPositionLookAt
    );
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
  }

  /**
   * Detact if nothing moves on screen, then play different idle animation
   */
  setIdleAnimationTimer() {
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

  /**
   * Setup camera initial position, and initial look at position
   */
  setCamera() {
    this.camCurrentPosition.set(5, 18, 5);
    this.camCurrentPositionLookAt.set(0, 17, 0);
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
   * Set up trigger event when player enter / leave shelf area
   */
  shelfTriggerEvent() {
    // Trigger event when player close to shelf
    this.shelfTriggerBody.addEventListener("collide", (e) => {
      // astronaut body id is 37
      if (e.body === this.astronautBody) {
        console.log("enter");
        // this.camera.instance.position.lerp(this.shelfCamPosition, 0.03);
      }
    });
    this.physicsWorld.addEventListener("endContact", (e) => {
      // astronaut body id is 37
      if (
        (e.bodyA === this.astronautBody && e.bodyB === this.shelfTriggerBody) ||
        (e.bodyB === this.astronautBody && e.bodyA === this.shelfTriggerBody)
      ) {
        console.log("leave");
      }
    });
  }

  /**
   * Animation setup
   */
  update() {
    // Update physics world
    this.physicsWorld.step(1 / 60, this.time.delta / 1000, 3);

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
          this.logoIndicator.children[0].material.opacity -= 0.05;
        }
      } else {
        if (this.logoIndicator.children[0].material.opacity < 0.5) {
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
      // Detect is shelf lies down, then hide the indicator
      this.shelfModel.matrix.extractBasis(
        this.shelfXAxis,
        this.shelfYAxis,
        this.shelfZAxis
      );
      if (
        this.shelfYAxis.angleTo(this.shelfModel.position) > 1 ||
        this.shelfModel.position.distanceTo(this.astronautMesh.position) > 8
      ) {
        if (this.projectsIndicator.children[0].material.opacity > 0) {
          this.projectsIndicator.children[0].material.opacity -= 0.05;
        }
      } else {
        if (this.projectsIndicator.children[0].material.opacity < 0.5) {
          this.projectsIndicator.children[0].material.opacity += 0.05;
        }
      }

      //Apply center gravity to lego car
      this.legoBody.force = this.applyGForce(
        this.gravityDirection,
        this.legoBody.position,
        this.legoBody.force,
        this.legoBody.mass
      );
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
      this.playerPlate.material.opacity =
        1 - (this.astronautToOrigin - this.planetRadius) * 0.3;

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
      if (this.keyMap["KeyW"]) {
        if (this.astronautBody.velocity.length() > 3.5) {
          this.astronautBody.velocity.copy(this.astronautBody.velocity);
        } else {
          this.astronautBody.velocity.copy(this.walkVelocityAndDir);
        }
        // update camera position when move forward
        this.camCurrentPosition.lerp(this.camNewPosition, 0.03);
        this.camCurrentPositionLookAt.lerp(this.camNewPositionLookAt, 0.03);

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
      if (this.keyMap["Space"] && this.astronautCollide && !this.spaceKeyDown) {
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
            0.03
          );
          this.camCurrentPositionLookAt.lerp(this.astronautBody.position, 0.03);
          // Camera movement
          this.camera.instance.position.copy(this.camCurrentPosition);
          this.camera.instance.lookAt(this.camCurrentPositionLookAt);
          this.astronaut.animation.play("idle1");
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
    this.camNewPosition.copy(this.camPosition.getWorldPosition(this.emptyVec3));
    this.camNewPositionLookAt.copy(
      this.camPositionLookAt.getWorldPosition(this.emptyVec3)
    );

    // Update camera up axis
    if (this.astronaut) {
      this.camera.instance.up.copy(this.astronautGravityDirection.scale(-1));
    }
  }
}
