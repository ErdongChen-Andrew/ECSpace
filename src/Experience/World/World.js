import * as CANNON from "cannon-es";
import * as THREE from "three";
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
    this.camIdlePosition = new THREE.Mesh();
    this.camPosition = new THREE.Mesh();
    this.camPositionLookAt = new THREE.Mesh();
    this.camNewPosition = new THREE.Vector3();
    this.camNewPositionLookAt = new THREE.Vector3();
    this.camCurrentPosition = new THREE.Vector3();
    this.camCurrentPositionLookAt = new THREE.Vector3();
    this.origin = new THREE.Vector3(0, 0, 0);
    this.emptyVec3 = new THREE.Vector3();
    this.emptyCannonVec3 = new CANNON.Vec3();
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
    const invisibleCubeGeo = new THREE.BoxGeometry(1, 1, 1);
    const invisibleCubeMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
    });
    this.camIdlePosition.geometry = invisibleCubeGeo;
    this.camIdlePosition.material = invisibleCubeMaterial;
    this.camPosition.geometry = invisibleCubeGeo;
    this.camPosition.material = invisibleCubeMaterial;
    this.camPositionLookAt.geometry = invisibleCubeGeo;
    this.camPositionLookAt.material = invisibleCubeMaterial;

    /**
     * Physics setup
     */
    this.gForce = 0.01;
    this.debugObejcts.gForceScale = 700;
    this.physicsWorld = new CANNON.World();
    this.physicsWorld.allowSleep = true;
    this.physicsWorld.solver.iterations = 10;
    this.physicsWorld.gravity.set(0, -this.gForce, 0);
    this.keyMap = {};

    // Set physics contact materials
    this.defaultMaterial = new CANNON.Material("default");
    this.defaultContactMaterial = new CANNON.ContactMaterial(
      this.defaultMaterial,
      this.defaultMaterial,
      {
        friction: 1.5,
        restitution: 0.3,
      }
    );
    this.physicsWorld.addContactMaterial(this.defaultContactMaterial);

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

      /**
       * Logo Setups
       */
      this.astronautDistanceToLogo = null;
      this.logoSet = new Logo();
      this.logoMesh = this.logoSet.logoModel;
      this.logoFixedPosition = new THREE.Vector3(0, 0, 18);

      // Planet setup
      this.planet = new Planet(this.defaultContactMaterial, this.physicsWorld);
      this.moonMesh = this.planet.moonMesh;
      this.planetRadius = this.planet.planetRadius;

      // Moon setup
      this.moonRadius = this.moonMesh.geometry.parameters.radius;
      this.moonGravityDirection = new CANNON.Vec3();
      this.moonInitialVelocity = 25;
      this.moonDistance = 150;

      // Astronaut setup
      this.astronaut = new Astronaut();
      this.astronautMesh = this.astronaut.model;
      this.astronautBodySize = new CANNON.Vec3(0.75, 1, 0.75);
      this.astronautGravityDirection = new CANNON.Vec3();

      /**
       *  Soccer game Setups
       */
      this.soccerGame = new SoccerGame(
        this.defaultContactMaterial,
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
        this.defaultContactMaterial,
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

      // Lego car setups
      this.legoBody = this.roomSet.legoBody;

      /**
       *  Explorer Setups
       */
      this.explorerSet = new ExplorerSet(
        this.defaultContactMaterial,
        this.physicsWorld
      );

      // Moon rover setups
      this.moonRoverBody = this.explorerSet.moonRoverBody;

      // Moon lander setups
      this.moonLanderBody = this.explorerSet.moonLanderBody;

      // Moon satellite setups
      this.moonSatelliteBody = this.explorerSet.moonSatelliteBody;

      // UFO setups
      this.ufoBody = this.explorerSet.ufoBody;

      this.setPlanetPhysics();
      this.setMoonPhysics();
      this.setAstronautPhysics();
      this.setPlayerControls();
      this.setIdleAnimationTimer();
      this.setCamera();
    });

    this.setBoarderPhysics();
  }

  /**
   * Crate a function to apply gravity force toward planet center
   */
  applyGForce(gForceDirection, bodyPosition, bodyForce, bodyMass) {
    gForceDirection.set(-bodyPosition.x, -bodyPosition.y, -bodyPosition.z);
    gForceDirection.normalize();
    bodyForce = gForceDirection.scale(
      this.debugObejcts.gForceScale * this.gForce
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
   * Basic physics setup (cannon-es) for all components
   */
  // Create invisible outside boarders
  setBoarderPhysics() {
    const boarderShape1 = new CANNON.Box(new CANNON.Vec3(150, 0, 150));
    const boarderShape2 = new CANNON.Box(new CANNON.Vec3(150, 150, 0));
    const boarderShape3 = new CANNON.Box(new CANNON.Vec3(0, 150, 150));

    const boarderBody = new CANNON.Body({ mass: 0 });

    boarderBody.addShape(boarderShape1, new CANNON.Vec3(0, 150, 0));
    boarderBody.addShape(boarderShape1, new CANNON.Vec3(0, -150, 0));
    boarderBody.addShape(boarderShape2, new CANNON.Vec3(0, 0, 150));
    boarderBody.addShape(boarderShape2, new CANNON.Vec3(0, 0, -150));
    boarderBody.addShape(boarderShape3, new CANNON.Vec3(150, 0, 0));
    boarderBody.addShape(boarderShape3, new CANNON.Vec3(-150, 0, 0));

    this.physicsWorld.addBody(boarderBody);
  }

  // Main planet physics setup
  setPlanetPhysics() {
    const planetShape = new CANNON.Sphere(this.planetRadius);
    const planetLandShape = new CANNON.Cylinder(7, 5, 3);

    this.planetBody = new CANNON.Body({
      shape: planetShape,
      material: this.defaultMaterial,
    });
    this.planetBody.addShape(planetLandShape, new CANNON.Vec3(0, -14.3, 0));
    this.physicsWorld.addBody(this.planetBody);
  }

  // Moon physics setup
  setMoonPhysics() {
    const moonShape = new CANNON.Sphere(this.moonRadius);
    this.moonBody = new CANNON.Body({
      mass: 1,
      shape: moonShape,
      material: this.defaultMaterial,
    });
    this.moonBody.position.set(this.moonDistance, 0, this.moonDistance);
    this.physicsWorld.addBody(this.moonBody);
    // Apply initial velocity
    this.moonBody.velocity = new CANNON.Vec3(0, this.moonInitialVelocity, 0);
  }

  // Astronaut physics setup
  setAstronautPhysics() {
    const astronautShape = new CANNON.Box(this.astronautBodySize);
    const supportShape = new CANNON.Sphere(0.7);

    this.astronautBody = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, this.planetRadius + 1.5, 0),
      material: this.defaultContactMaterial,
    });
    this.astronautBody.addShape(astronautShape);
    this.astronautBody.addShape(supportShape, new CANNON.Vec3(0, -0.7, 0));
    this.astronautBody.addShape(supportShape);
    this.astronautBody.addShape(supportShape, new CANNON.Vec3(0, 0.7, 0));
    this.astronautBody.allowSleep = false;
    this.physicsWorld.addBody(this.astronautBody);
    this.astronautCollide = false;
    this.contactNormal = new CANNON.Vec3();

    // Lock character from free rolling
    // this.astronautBody.angularDamping = 0.9;

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
      if (this.contactNormal.dot(this.upAxis) > 0.5)
        // Use a "good" threshold value between 0 and 1 here!
        this.astronautCollide = true;

      // if the collide body is soccer ball
      if (e.contact.bi.id == this.soccerBallBody.id) {
        // When current soccer velocity is larger than current astronaut velocity,
        // kick the soccer back and play "run" animation once
        if (
          this.soccerBallBody.velocity.lengthSquared() >
          this.astronautBody.velocity.lengthSquared()
        ) {
          this.astronaut.animation.play("run");
          this.soccerBallBody.velocity = this.soccerBallBody.velocity.scale(-1);
        }
      }
    });
  }

  /**
   * Set up basic controls for controling the astronaut
   */
  setPlayerControls() {
    // setup
    this.forwardAxis = new THREE.Vector3(-1, 0, 0);
    this.turnAxis = new THREE.Vector3(0, 1, 0);
    this.playerGroup = new THREE.Object3D();
    this.astronautBodySpherical = new THREE.Spherical();

    // control properties
    this.walkRad = 0.004;
    this.heightLimit = 17;
    this.jumpHeight = new CANNON.Vec3(0, 4, 0);

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
    }

    // Dust mesh update
    if (this.planet) {
      this.planet.update();
    }

    // Update moon physics
    if (this.moonBody) {
      this.moonMesh.position.copy(this.moonBody.position);
      this.moonMesh.quaternion.copy(this.moonBody.quaternion);
      this.moonBody.force = this.applyGForce(
        this.moonGravityDirection,
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
    }

    // Update astronaut physics
    if (this.astronaut) {
      this.astronaut.update();
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

      // Set asronaut body spherical cordinate from player plate position
      this.astronautBodySpherical.setFromVector3(
        this.playerPlate.getWorldPosition(this.emptyVec3)
      );
      this.astronautBody.position.copy(
        this.emptyVec3.setFromSphericalCoords(
          this.astronautToOrigin,
          this.astronautBodySpherical.phi,
          this.astronautBodySpherical.theta
        )
      );

      // Match astronaut mash to follow physic body
      this.astronautMesh.position.copy(this.astronautBody.position);
      this.astronautMesh.quaternion.copy(this.astronautBody.quaternion);
    }

    // Astronut movement controls
    // Moving forward
    if (this.keyMap["KeyW"]) {
      this.playerGroup.rotateOnAxis(this.forwardAxis, -this.walkRad);
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
      this.playerGroup.rotateOnAxis(this.forwardAxis, this.walkRad * 0.2);
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
      // Delay jump action to match jump animation
      let jumpTimeout;
      clearTimeout(jumpTimeout);
      jumpTimeout = setTimeout(() => {
        this.astronautBody.quaternion.vmult(
          this.jumpHeight,
          this.astronautBody.velocity
        );
      }, 200);

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

        this.camera.instance.position.copy(this.camCurrentPosition);
        this.camera.instance.lookAt(this.camCurrentPositionLookAt);
        this.astronaut.animation.play("idle1");
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
