import * as THREE from "three";
import * as CANNON from "cannon-es";
import Experience from "../Experience";

export default class SoccerGame {
  constructor(defaultContactMaterial, physicsWorld, applyRotation) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.defaultContactMaterial = defaultContactMaterial;
    this.physicsWorld = physicsWorld;
    this.upAxis = new CANNON.Vec3(0, 1, 0);
    this.applyRotation = applyRotation;

    // Soccer ball materials and textures setup
    this.soccerBlackMaterial = new THREE.MeshMatcapMaterial();
    this.soccerWhiteMaterial = new THREE.MeshMatcapMaterial();
    this.soccerBlackTexture = this.resources.items.soccerBlackMatcapTexture;
    this.soccerWhiteTexture = this.resources.items.astronautBodyMatcapTexture;
    this.soccerBlackTexture.encoding = THREE.sRGBEncoding;
    this.soccerWhiteTexture.encoding = THREE.sRGBEncoding;

    // Soccer goal frame material and texture setup
    this.soccerGoalFrameMaterial = new THREE.MeshMatcapMaterial();
    this.soccerGoalAngryMaterial = new THREE.MeshMatcapMaterial();
    this.soccerGoalFrameTexture =
      this.resources.items.astronautTrimMatcapTexture;
    this.soccerGoalAngryTexture =
      this.resources.items.astronautBodyMatcapTexture;
    this.soccerGoalFrameTexture.encoding = THREE.sRGBEncoding;
    this.soccerGoalAngryTexture.encoding = THREE.sRGBEncoding;

    // Soccer goal nets material and texture setup
    this.soccerGoalNetMaterial = new THREE.MeshBasicMaterial();
    this.soccerGoalNetMaterialSides = new THREE.MeshBasicMaterial();
    this.soccerGoalNetTexture = this.resources.items.soccerNetMap;
    this.soccerGoalNetTexture.repeat = new THREE.Vector2(5, 4);
    this.soccerGoalNetTexture.wrapS = THREE.RepeatWrapping;
    this.soccerGoalNetTexture.wrapT = THREE.RepeatWrapping;
    this.soccerGoalNetTexture.minFilter = THREE.NearestFilter;
    this.soccerGoalNetTexture.generateMipmaps = false;

    // Set different texture for soccer goal side nets
    this.soccerGoalNetTextureSides = this.resources.items.soccerNetSidesMap;
    this.soccerGoalNetTextureSides.repeat = new THREE.Vector2(1, 1);
    this.soccerGoalNetTextureSides.wrapS = THREE.RepeatWrapping;
    this.soccerGoalNetTextureSides.wrapT = THREE.RepeatWrapping;
    this.soccerGoalNetTextureSides.minFilter = THREE.NearestFilter;
    this.soccerGoalNetTextureSides.generateMipmaps = false;

    this.soccerGoalGroup = new THREE.Group();

    // Grass materials and textures setup
    this.grassMaterial = new THREE.MeshMatcapMaterial();
    this.woodMaterial = new THREE.MeshMatcapMaterial();
    this.grassTexture = this.resources.items.grassMatcapTexture;
    this.woodTexture = this.resources.items.woodMatcapTexture;
    this.grassTexture.encoding = THREE.sRGBEncoding;
    this.woodTexture.encoding = THREE.sRGBEncoding;

    // Tree materials and textures setup
    this.treeMaterial = new THREE.MeshMatcapMaterial();
    this.treeTexture = this.resources.items.treeMatcapTexture;
    this.treeTexture.encoding = THREE.sRGBEncoding;

    // Soccer ball model and physics
    this.setSoccerBall();
    this.setSoccerBallPhysics();

    // Soccer goal model and physics
    this.setSoccerGoal();
    this.setSoccerGoalPhysics();

    // Grass model and physics
    this.setGrass();
    this.setGrassPhysics();

    // Tree model and physics
    this.setTree();
    this.setTreePhysics();
  }

  /**
   * ThreeJS set up
   */
  // Set up the soccer ball
  setSoccerBall() {
    this.soccerBallModel = this.resources.items.soccerBallModel.scene;
    this.soccerBallModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material.name === "black") {
          child.material = this.soccerWhiteMaterial;
          this.soccerWhiteMaterial.matcap = this.soccerWhiteTexture;
        }
        if (child.material.name === "Material.001") {
          child.material = this.soccerBlackMaterial;
          this.soccerBlackMaterial.matcap = this.soccerBlackTexture;
        }
      }
    });
    this.scene.add(this.soccerBallModel);
  }

  // Set up the soccer goal
  setSoccerGoal() {
    this.soccerGoalNetMaterial.alphaMap = this.soccerGoalNetTexture;
    this.soccerGoalNetMaterial.side = THREE.DoubleSide;
    this.soccerGoalNetMaterial.transparent = true;

    // Set different material for side nets
    this.soccerGoalNetMaterialSides.alphaMap = this.soccerGoalNetTextureSides;
    this.soccerGoalNetMaterialSides.side = THREE.DoubleSide;
    this.soccerGoalNetMaterialSides.transparent = true;

    /**
     * Set up each goal net mesh
     */
    // Back goal net mesh
    const backNetMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 4),
      this.soccerGoalNetMaterial
    );
    backNetMesh.rotation.x = 0.4;
    backNetMesh.position.z = -1.2;
    backNetMesh.name = "backNetMesh";
    this.soccerGoalGroup.add(backNetMesh);

    // Top goal net mesh
    const topNetMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 2.3),
      this.soccerGoalNetMaterial
    );
    topNetMesh.rotation.x = Math.PI / 2;
    topNetMesh.position.y = 1.9;
    topNetMesh.position.z = 0.7;
    topNetMesh.name = "topNetMesh";
    this.soccerGoalGroup.add(topNetMesh);

    // Left & right goal net mesh
    // Create spcific net shape for left & right net
    const leftRightNetShape = new THREE.Shape([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(3.8, 0, 0),
      new THREE.Vector3(2.3, 3.8, 0),
      new THREE.Vector3(0, 3.8, 0),
    ]);

    // Left side net mesh
    const leftNetMesh = new THREE.Mesh(
      new THREE.ShapeGeometry(leftRightNetShape),
      this.soccerGoalNetMaterialSides
    );
    leftNetMesh.rotation.y = Math.PI / 2;
    leftNetMesh.position.y = -1.9;
    leftNetMesh.position.z = 1.9;
    leftNetMesh.position.x = -3.1;
    leftNetMesh.name = "leftNetMesh";

    // Right side net mesh
    const rightNetMesh = new THREE.Mesh(
      new THREE.ShapeGeometry(leftRightNetShape),
      this.soccerGoalNetMaterialSides
    );
    rightNetMesh.rotation.y = Math.PI / 2;
    rightNetMesh.position.y = -1.9;
    rightNetMesh.position.z = 1.9;
    rightNetMesh.position.x = 3.1;
    rightNetMesh.name = "rightNetMesh";
    this.soccerGoalGroup.add(leftNetMesh, rightNetMesh);

    // Load soccer goal frame model
    this.soccerGoalModel = this.resources.items.soccerGoalModel.scene;
    this.soccerGoalModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "goalFrame") {
          child.material = this.soccerGoalFrameMaterial;
          this.soccerGoalFrameMaterial.matcap = this.soccerGoalFrameTexture;
        }
        if (child.name === "angry") {
          child.material = this.soccerGoalAngryMaterial;
          this.soccerGoalAngryMaterial.transparent = true;
          this.soccerGoalAngryMaterial.opacity = 0;
          this.soccerGoalAngryMaterial.matcap = this.soccerGoalAngryTexture;
        }
      }
    });
    this.soccerGoalGroup.add(this.soccerGoalModel);
    this.scene.add(this.soccerGoalGroup);
  }

  // Set up grass model
  setGrass() {
    this.grassNumber = 3;
    this.grassSet = [];
    for (let i = 0; i < this.grassNumber; i++) {
      this.grassSet[i] = this.resources.items.grassModel.scene.clone();
      this.grassSet[i].traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.name === "grass") {
            child.material = this.grassMaterial;
            this.grassMaterial.matcap = this.grassTexture;
          }
          if (child.name === "holder") {
            child.material = this.woodMaterial;
            this.woodMaterial.matcap = this.woodTexture;
          }
        }
      });
      this.scene.add(this.grassSet[i]);
    }
  }

  // Set up tree model
  setTree() {
    this.treeNumber = 3;
    this.treeSet = [];
    for (let i = 0; i < this.treeNumber; i++) {
      this.treeSet[i] = this.resources.items.treeModel.scene.clone();
      this.treeSet[i].traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.name === "tree") {
            child.material = this.grassMaterial;
            this.grassMaterial.matcap = this.grassTexture;
          }
          if (child.name === "tree001") {
            child.material = this.treeMaterial;
            this.treeMaterial.matcap = this.treeTexture;
          }
          if (child.name === "wood") {
            child.material = this.woodMaterial;
            this.woodMaterial.matcap = this.woodTexture;
          }
        }
      });
      this.scene.add(this.treeSet[i]);
    }
  }

  /**
   * Physics setup
   */
  setSoccerBallPhysics() {
    const soccerBallShape = new CANNON.Sphere(1);
    this.soccerBallBody = new CANNON.Body({
      mass: 1,
      shape: soccerBallShape,
      material: this.defaultMaterial,
    });
    this.soccerBallBody.position.set(-10, 13, 0);
    this.physicsWorld.addBody(this.soccerBallBody);
  }

  setSoccerGoalPhysics() {
    let backNetShape;
    let topNetShape;
    let sideNetShape;
    let sideNetWidth;
    let sideBlockShape;
    let sideNetHeight = 3.8;
    let shapeThick = 0.1;
    let soccerGoalAngryMesh;
    let soccerGoalAngryMaterial;
    let soccerGoalAngryTexture =
      this.resources.items.astronautBodyMatcapTexture;
    let soccerGoalAngryRedTexture =
      this.resources.items.astronautRedMatcapTexture;

    this.soccerGoalBody = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
    });

    if (this.soccerGoalGroup) {
      this.soccerGoalGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Get the angry icon for later goal event
          if (child.name === "angry") {
            soccerGoalAngryMesh = child;
            soccerGoalAngryMaterial = child.material;
          }
          // create physics bodys for each net, and form as a soccer goal
          // Back goal net body
          if (child.name === "backNetMesh") {
            let width = child.geometry.parameters.width;
            let height = child.geometry.parameters.height;
            let offsetPosition = child.position;
            let offsetQuaternion = child.quaternion;
            backNetShape = new CANNON.Box(
              new CANNON.Vec3(width / 2, height / 2, shapeThick)
            );
            this.soccerGoalBody.addShape(
              backNetShape,
              new CANNON.Vec3().copy(offsetPosition),
              new CANNON.Quaternion().copy(offsetQuaternion)
            );
          }

          // Top goal net body
          if (child.name === "topNetMesh") {
            let width = child.geometry.parameters.width;
            let height = child.geometry.parameters.height;
            sideNetWidth = height;
            let offsetPosition = child.position;
            let offsetQuaternion = child.quaternion;
            topNetShape = new CANNON.Box(
              new CANNON.Vec3(width / 2, height / 2, shapeThick)
            );
            this.soccerGoalBody.addShape(
              topNetShape,
              new CANNON.Vec3().copy(offsetPosition),
              new CANNON.Quaternion().copy(offsetQuaternion)
            );
          }

          // Left goal net body
          if (child.name === "leftNetMesh") {
            let offsetPosition = child.position;
            let offsetQuaternion = child.quaternion;
            sideNetShape = new CANNON.Box(
              new CANNON.Vec3(sideNetWidth / 2, sideNetHeight / 2, shapeThick)
            );
            sideBlockShape = new CANNON.Box(
              new CANNON.Vec3(sideNetWidth / 4, sideNetHeight / 10, shapeThick)
            );
            this.soccerGoalBody.addShape(
              sideNetShape,
              new CANNON.Vec3().set(
                offsetPosition.x,
                offsetPosition.y + 1.8,
                offsetPosition.z / 3
              ),
              new CANNON.Quaternion().copy(offsetQuaternion)
            );
            this.soccerGoalBody.addShape(
              sideBlockShape,
              new CANNON.Vec3().set(
                offsetPosition.x,
                offsetPosition.y + 0.5,
                offsetPosition.z - 3
              ),
              new CANNON.Quaternion().copy(offsetQuaternion)
            );
          }

          // Right goal net body
          if (child.name === "rightNetMesh") {
            let offsetPosition = child.position;
            let offsetQuaternion = child.quaternion;
            sideNetShape = new CANNON.Box(
              new CANNON.Vec3(sideNetWidth / 2, sideNetHeight / 2, shapeThick)
            );
            sideBlockShape = new CANNON.Box(
              new CANNON.Vec3(sideNetWidth / 4, sideNetHeight / 10, shapeThick)
            );
            this.soccerGoalBody.addShape(
              sideNetShape,
              new CANNON.Vec3().set(
                offsetPosition.x,
                offsetPosition.y + 1.8,
                offsetPosition.z / 3
              ),
              new CANNON.Quaternion().copy(offsetQuaternion)
            );
            this.soccerGoalBody.addShape(
              sideBlockShape,
              new CANNON.Vec3().set(
                offsetPosition.x,
                offsetPosition.y + 0.5,
                offsetPosition.z - 3
              ),
              new CANNON.Quaternion().copy(offsetQuaternion)
            );
          }
        }
      });

      // Move soccer goal to its position
      this.soccerGoalBody.position.x = -17;
      let rotation = this.applyRotation(-Math.PI / 2, 0, Math.PI / 2);
      this.soccerGoalBody.quaternion.copy(rotation);

      // Set up goal event trigger body
      this.triggerShape = new CANNON.Box(new CANNON.Vec3(2, 1, 0.5));
      this.triggerBody = new CANNON.Body({ isTrigger: true });
      this.triggerBody.addShape(this.triggerShape);
    }
    this.physicsWorld.addBody(this.soccerGoalBody);
    this.physicsWorld.addBody(this.triggerBody);

    /**
     * Handling goal trigger event
     */
    let pushBallBack;
    let goalCount = 0;

    // soccer is entering the soccer goal
    this.triggerBody.addEventListener("collide", (e) => {
      if (e.body === this.soccerBallBody) {
        clearTimeout(pushBallBack);
        // Show soccer goal angry icon
        soccerGoalAngryMaterial.opacity = 1;
        goalCount += 1;
        // Once goal counts 3, large the angry icon and change the color to red, also hit back soccer at a higher speed
        if (goalCount === 3) {
          goalCount = 0;
          soccerGoalAngryMaterial.matcap = soccerGoalAngryRedTexture;
          soccerGoalAngryMesh.scale.set(1.5, 1.5, 1.5);
          pushBallBack = setTimeout(() => {
            this.soccerBallBody.velocity =
              this.soccerBallBody.velocity.scale(-8);
          }, 1000);
        }
        // Initialize angry icon color and size
        else {
          soccerGoalAngryMaterial.matcap = soccerGoalAngryTexture;
          soccerGoalAngryMesh.scale.set(0.8, 0.8, 0.8);
          pushBallBack = setTimeout(() => {
            this.soccerBallBody.velocity =
              this.soccerBallBody.velocity.scale(-2);
          }, 200);
        }
      }
    });
    // soccer is leaving the soccer goal
    this.physicsWorld.addEventListener("endContact", (e) => {
      if (
        (e.bodyA === this.soccerBallBody && e.bodyB === this.triggerBody) ||
        (e.bodyB === this.soccerBallBody && e.bodyA === this.triggerBody)
      ) {
        // Hide soccer goal angry icon
        soccerGoalAngryMaterial.opacity = 0;
      }
    });
  }

  setGrassPhysics() {
    this.grassBodySet = [];
    const grassSize = new CANNON.Vec3(0.2, 0.5, 0.7);
    const grassShape = new CANNON.Box(grassSize);
    const supportShape = new CANNON.Sphere(0.2)

    for (let i = 0; i < this.grassNumber; i++) {
      this.grassBodySet[i] = new CANNON.Body({
        mass: 1,
        material: this.defaultMaterial,
      });
      this.grassBodySet[i].addShape(grassShape, new CANNON.Vec3(-0.15, 0, 0));
      this.grassBodySet[i].addShape(supportShape, new CANNON.Vec3(-0.15, 0, 0));
      this.physicsWorld.addBody(this.grassBodySet[i]);
    }

    // set position for each grass body
    this.grassBodySet[0].position.x = -13;
    this.grassBodySet[0].position.y = 3;
    this.grassBodySet[0].position.z = -8;
    this.grassBodySet[0].quaternion.setFromVectors(
      this.upAxis,
      this.grassBodySet[0].position
    );

    this.grassBodySet[1].position.x = -13;
    this.grassBodySet[1].position.y = 7;
    this.grassBodySet[1].position.z = -5;
    this.grassBodySet[1].quaternion.setFromVectors(
      this.upAxis,
      this.grassBodySet[1].position
    );

    this.grassBodySet[2].position.x = -14;
    this.grassBodySet[2].position.y = 4;
    this.grassBodySet[2].position.z = 6;
    this.grassBodySet[2].quaternion.setFromVectors(
      this.upAxis,
      this.grassBodySet[2].position
    );
  }

  setTreePhysics() {
    this.treeBodySet = [];
    const treeSize = new CANNON.Vec3(0.3, 1.5, 1.8);
    const woodSize = new CANNON.Vec3(0.4, 1.5, 0.4);

    const treeShape = new CANNON.Box(treeSize);
    const woodShape = new CANNON.Box(woodSize);

    for (let i = 0; i < this.treeNumber; i++) {
      this.treeBodySet[i] = new CANNON.Body({
        mass: 1,
        material: this.defaultMaterial,
      });
      this.treeBodySet[i].addShape(treeShape, new CANNON.Vec3(0, 2, 0));
      this.treeBodySet[i].addShape(
        woodShape,
        new CANNON.Vec3(0, -0.4, 0),
        new CANNON.Quaternion().setFromAxisAngle(
          new CANNON.Vec3(0, 1, 0),
          Math.PI / 4
        )
      );
      this.physicsWorld.addBody(this.treeBodySet[i]);
    }

    // set position for each tree body
    this.treeBodySet[0].position.x = -13;
    this.treeBodySet[0].position.y = -6;
    this.treeBodySet[0].position.z = -10;
    this.treeBodySet[0].quaternion.setFromVectors(
      this.upAxis,
      this.treeBodySet[0].position
    );

    this.treeBodySet[1].position.x = -11;
    this.treeBodySet[1].position.y = 4;
    this.treeBodySet[1].position.z = 13;
    this.treeBodySet[1].quaternion.setFromVectors(
      this.upAxis,
      this.treeBodySet[1].position
    );

    this.treeBodySet[2].position.x = -14;
    this.treeBodySet[2].position.y = -10;
    this.treeBodySet[2].position.z = 3;
    this.treeBodySet[2].quaternion.setFromVectors(
      this.upAxis,
      this.treeBodySet[2].position
    );
  }

  /**
   * Physics update
   */
  update() {
    /**
     * Soccer ball physics update
     */
    this.soccerBallModel.position.copy(this.soccerBallBody.position);
    this.soccerBallModel.quaternion.copy(this.soccerBallBody.quaternion);

    /**
     * Soccer goal physics update
     */
    // Update soccer gaol physics
    this.soccerGoalGroup.position.copy(this.soccerGoalBody.position);
    this.soccerGoalGroup.quaternion.copy(this.soccerGoalBody.quaternion);
    // Update soccer gaol trigger box physics
    this.triggerBody.position.copy(this.soccerGoalBody.position);
    this.triggerBody.quaternion.copy(this.soccerGoalBody.quaternion);

    /**
     * Grass physics update
     */
    this.grassSet.forEach((item, index) => {
      item.position.copy(this.grassBodySet[index].position);
      item.quaternion.copy(this.grassBodySet[index].quaternion);
    });

    /**
     * Tree physics update
     */
    this.treeSet.forEach((item, index) => {
      item.position.copy(this.treeBodySet[index].position);
      item.quaternion.copy(this.treeBodySet[index].quaternion);
    });
  }
}
