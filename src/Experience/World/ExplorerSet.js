import * as THREE from "three";
import * as CANNON from "cannon-es";
import Experience from "../Experience";

export default class ExplorerSet {
  constructor(defaultContactMaterial, physicsWorld) {
    // Setups
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.defaultContactMaterial = defaultContactMaterial;
    this.physicsWorld = physicsWorld;
    this.upAxis = new CANNON.Vec3(0, 1, 0);

    // Moon rover materials and textures setup
    this.moonRoverSilverMaterial = new THREE.MeshMatcapMaterial();
    this.moonRoverCopperMaterial = new THREE.MeshMatcapMaterial();
    this.moonRoverBlackMaterial = new THREE.MeshMatcapMaterial();
    this.moonRoverRedMaterial = new THREE.MeshMatcapMaterial();
    this.moonRoverSilverTexture =
      this.resources.items.moonRoverSilverMatcapTexture;
    this.moonRoverCopperTexture =
      this.resources.items.moonRoverCopperMatcapTexture;
    this.moonRoverBlackTexture = this.resources.items.tableTopMatcapTexture;
    this.moonRoverRedTexture = this.resources.items.moonRoverRedMatcapTexture;
    this.moonRoverSilverTexture.encoding = THREE.sRGBEncoding;
    this.moonRoverCopperTexture.encoding = THREE.sRGBEncoding;
    this.moonRoverBlackTexture.encoding = THREE.sRGBEncoding;
    this.moonRoverRedTexture.encoding = THREE.sRGBEncoding;

    // Moon satellite materials and textures setup
    this.moonSatelliteYellowMaterial = new THREE.MeshMatcapMaterial();
    this.moonSatelliteYellowTexture =
      this.resources.items.moonSatelliteYellowMatcapTexture;
    this.moonSatelliteYellowTexture.encoding = THREE.sRGBEncoding;

    // UFO materials and textures setup
    this.ufoGrayMaterial = new THREE.MeshMatcapMaterial();
    this.ufoWhiteMaterial = new THREE.MeshMatcapMaterial();
    this.ufoBlackMaterial = new THREE.MeshMatcapMaterial();
    this.ufoBlueMaterial = new THREE.MeshMatcapMaterial();
    this.ufoGrayTexture = this.resources.items.ufoGrayMatcapTexture;
    this.ufoWhiteTexture = this.resources.items.ufoWhiteMatcapTexture;
    this.ufoBlackTexture = this.resources.items.ufoBlackMatcapTexture;
    this.ufoBlueTexture = this.resources.items.ufoBlueMatcapTexture;
    this.ufoGrayTexture.encoding = THREE.sRGBEncoding;
    this.ufoWhiteTexture.encoding = THREE.sRGBEncoding;
    this.ufoBlackTexture.encoding = THREE.sRGBEncoding;
    this.ufoBlueTexture.encoding = THREE.sRGBEncoding;

    // Moon rover model and physics
    this.setMoonRover();
    this.setMoonRoverPhysics();

    // Moon lander model and physics
    this.setMoonLander();
    this.setMoonLanderPhysics();

    // Moon satellite model and physics
    this.setMoonSatellite();
    this.setMoonSatellitePhysics();

    // UFO model and physics
    this.setUFO();
    this.setUFOPhysics();
  }

  /**
   * ThreeJS set up
   */
  // Set up the moon rover model
  setMoonRover() {
    this.moonRoverModel = this.resources.items.moonRoverModel.scene;
    this.moonRoverWheelsModel = this.resources.items.moonRoverWheelsModel.scene;

    // Apply moon rover material and texture
    this.moonRoverModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "silver") {
          child.material = this.moonRoverSilverMaterial;
          this.moonRoverSilverMaterial.matcap = this.moonRoverSilverTexture;
        }
        if (child.name === "copper") {
          child.material = this.moonRoverCopperMaterial;
          this.moonRoverCopperMaterial.matcap = this.moonRoverCopperTexture;
        }
        if (child.name === "black") {
          child.material = this.moonRoverBlackMaterial;
          this.moonRoverBlackMaterial.matcap = this.moonRoverBlackTexture;
        }
        if (child.name === "flag") {
          child.material = this.moonRoverRedMaterial;
          this.moonRoverRedMaterial.matcap = this.moonRoverRedTexture;
        }
      }
    });
    this.scene.add(this.moonRoverModel);

    // Apply moon rover wheels material and texture
    this.moonRoverWheelsModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = this.moonRoverBlackMaterial;
        this.moonRoverBlackMaterial.matcap = this.moonRoverBlackTexture;
        if (child.name === "wheel") {
          this.wheelLFMesh = child;
          this.wheelLFPosition = child.position;
        }
        if (child.name === "wheel001") {
          this.wheelRFMesh = child;
          this.wheelRFPosition = child.position;
        }
        if (child.name === "wheel002") {
          this.wheelLMMesh = child;
          this.wheelLMPosition = child.position;
        }
        if (child.name === "wheel003") {
          this.wheelRMMesh = child;
          this.wheelRMPosition = child.position;
        }
        if (child.name === "wheel004") {
          this.wheelLBMesh = child;
          this.wheelLBPosition = child.position;
        }
        if (child.name === "wheel005") {
          this.wheelRBMesh = child;
          this.wheelRBPosition = child.position;
        }
      }
    });
    this.scene.add(this.moonRoverWheelsModel);
  }

  // Set up the moon lander model
  setMoonLander() {
    this.moonLanderModel = this.resources.items.moonLanderModel.scene;

    // Apply moon lander material and texture
    this.moonLanderModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "silver") {
          child.material = this.moonRoverSilverMaterial;
          this.moonRoverSilverMaterial.matcap = this.moonRoverSilverTexture;
        }
        if (child.name === "copper") {
          child.material = this.moonRoverCopperMaterial;
          this.moonRoverCopperMaterial.matcap = this.moonRoverCopperTexture;
        }
        if (child.name === "black") {
          child.material = this.moonRoverBlackMaterial;
          this.moonRoverBlackMaterial.matcap = this.moonRoverBlackTexture;
        }
        if (child.name === "flag") {
          child.material = this.moonRoverRedMaterial;
          this.moonRoverRedMaterial.matcap = this.moonRoverRedTexture;
        }
      }
    });
    this.scene.add(this.moonLanderModel);
  }

  // Set up the moon satellite model
  setMoonSatellite() {
    this.moonSatelliteModel = this.resources.items.moonSatelliteModel.scene;

    // Apply moon satellite material and texture
    this.moonSatelliteModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "silver002") {
          child.material = this.moonRoverSilverMaterial;
          this.moonRoverSilverMaterial.matcap = this.moonRoverSilverTexture;
        }
        if (child.name === "copper002") {
          child.material = this.moonRoverCopperMaterial;
          this.moonRoverCopperMaterial.matcap = this.moonRoverCopperTexture;
        }
        if (child.name === "black002") {
          child.material = this.moonRoverBlackMaterial;
          this.moonRoverBlackMaterial.matcap = this.moonRoverBlackTexture;
        }
        if (child.name === "yellow") {
          child.material = this.moonSatelliteYellowMaterial;
          this.moonSatelliteYellowMaterial.matcap =
            this.moonSatelliteYellowTexture;
          this.moonSatelliteYellowMaterial.side = THREE.DoubleSide;
          this.moonSatelliteYellowMaterial.transparent = true;
          this.moonSatelliteYellowMaterial.opacity = 0.5;
        }
      }
    });
    this.scene.add(this.moonSatelliteModel);
  }

  // Set up the UFO model
  setUFO() {
    this.ufoModel = this.resources.items.ufoModel.scene;

    // Apply UFO material and texture
    this.ufoModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "ufoGray") {
          child.material = this.ufoGrayMaterial;
          this.ufoGrayMaterial.matcap = this.ufoGrayTexture;
        }
        if (child.name === "ufoWhite") {
          child.material = this.ufoWhiteMaterial;
          this.ufoWhiteMaterial.matcap = this.ufoWhiteTexture;
        }
        if (child.name === "ufoBlack") {
          child.material = this.ufoBlackMaterial;
          this.ufoBlackMaterial.matcap = this.ufoBlackTexture;
        }
        if (child.name === "ufoBlue") {
          child.material = this.ufoBlueMaterial;
          this.ufoBlueMaterial.matcap = this.ufoBlueTexture;
        }
      }
    });
    this.scene.add(this.ufoModel);
  }

  /**
   * Physics setups
   */
  // Set up the moon rover physics
  setMoonRoverPhysics() {
    // Initial setups
    this.forwardSpeed = -5;
    this.turningAngle = 0.2;
    const moonRoverMass = 1;
    const wheelMass = 1;
    const moonRoverPositionX = 10;
    const moonRoverPositionY = -2;
    const moonRoverPositionZ = -13;

    // Add moon rover body
    const moonRoverShape1 = new CANNON.Box(new CANNON.Vec3(0.3, 0.55, 0.2));
    const moonRoverShape2 = new CANNON.Box(new CANNON.Vec3(0.95, 0.55, 0.03));
    const moonRoverShape3 = new CANNON.Cylinder(0.05, 0.05, 0.75);
    this.moonRoverBody = new CANNON.Body({
      mass: moonRoverMass,
      material: this.defaultContactMaterial,
    });
    this.moonRoverBody.addShape(moonRoverShape1, new CANNON.Vec3(0, 0, -0.17));
    this.moonRoverBody.addShape(moonRoverShape2, new CANNON.Vec3(0, 0, -0.4));
    this.moonRoverBody.addShape(
      moonRoverShape3,
      new CANNON.Vec3(0, 0.35, -0.8),
      new CANNON.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        Math.PI / 2
      )
    );
    // Move moon rover positiion
    this.moonRoverBody.position.set(
      moonRoverPositionX,
      moonRoverPositionY,
      moonRoverPositionZ
    );
    this.moonRoverBody.angularDamping = 0.9;
    this.physicsWorld.addBody(this.moonRoverBody);

    // Add left front wheel body
    const wheelShape = new CANNON.Sphere(0.16);
    this.wheelLFBody = new CANNON.Body({
      mass: wheelMass,
      material: this.defaultContactMaterial,
    });
    this.wheelLFBody.addShape(wheelShape);
    this.wheelLFBody.position.set(
      this.wheelLFPosition.x + moonRoverPositionX,
      this.wheelLFPosition.y + moonRoverPositionY,
      this.wheelLFPosition.z + moonRoverPositionZ
    );
    this.physicsWorld.addBody(this.wheelLFBody);

    // Add right front wheel body
    this.wheelRFBody = new CANNON.Body({
      mass: wheelMass,
      material: this.defaultContactMaterial,
    });
    this.wheelRFBody.addShape(wheelShape);
    this.wheelRFBody.position.set(
      this.wheelRFPosition.x + moonRoverPositionX,
      this.wheelRFPosition.y + moonRoverPositionY,
      this.wheelRFPosition.z + moonRoverPositionZ
    );
    this.physicsWorld.addBody(this.wheelRFBody);

    // Add left middle wheel body
    this.wheelLMBody = new CANNON.Body({
      mass: wheelMass,
      material: this.defaultContactMaterial,
    });
    this.wheelLMBody.addShape(wheelShape);
    this.wheelLMBody.position.set(
      this.wheelLMPosition.x + moonRoverPositionX,
      this.wheelLMPosition.y + moonRoverPositionY,
      this.wheelLMPosition.z + moonRoverPositionZ
    );
    this.physicsWorld.addBody(this.wheelLMBody);

    // Add right middle wheel body
    this.wheelRMBody = new CANNON.Body({
      mass: wheelMass,
      material: this.defaultContactMaterial,
    });
    this.wheelRMBody.addShape(wheelShape);
    this.wheelRMBody.position.set(
      this.wheelRMPosition.x + moonRoverPositionX,
      this.wheelRMPosition.y + moonRoverPositionY,
      this.wheelRMPosition.z + moonRoverPositionZ
    );
    this.physicsWorld.addBody(this.wheelRMBody);

    // Add left back wheel body
    this.wheelLBBody = new CANNON.Body({
      mass: wheelMass,
      material: this.defaultContactMaterial,
    });
    this.wheelLBBody.addShape(wheelShape);
    this.wheelLBBody.position.set(
      this.wheelLBPosition.x + moonRoverPositionX,
      this.wheelLBPosition.y + moonRoverPositionY,
      this.wheelLBPosition.z + moonRoverPositionZ
    );
    this.physicsWorld.addBody(this.wheelLBBody);

    // Add right back wheel body
    this.wheelRBBody = new CANNON.Body({
      mass: wheelMass,
      material: this.defaultContactMaterial,
    });
    this.wheelRBBody.addShape(wheelShape);
    this.wheelRBBody.position.set(
      this.wheelRBPosition.x + moonRoverPositionX,
      this.wheelRBPosition.y + moonRoverPositionY,
      this.wheelRBPosition.z + moonRoverPositionZ
    );
    this.physicsWorld.addBody(this.wheelRBBody);

    // Preset wheels rotate axis for later wheels constraint
    const leftFrontAxis = new CANNON.Vec3(1, 0, 0);
    const rightFrontAxis = new CANNON.Vec3(1, 0, 0);
    const leftMiddleAxis = new CANNON.Vec3(1, 0, 0);
    const rightMiddleAxis = new CANNON.Vec3(1, 0, 0);
    const leftBackAxis = new CANNON.Vec3(1, 0, 0);
    const rightBackAxis = new CANNON.Vec3(1, 0, 0);

    // Preset wheels pivot for later wheels constraint
    const leftFrontPivotA = new THREE.Vector3().subVectors(
      this.wheelLFPosition,
      this.moonRoverModel.position
    );
    const rightFrontPivotA = new THREE.Vector3().subVectors(
      this.wheelRFPosition,
      this.moonRoverModel.position
    );
    const leftMiddlePivotA = new THREE.Vector3().subVectors(
      this.wheelLMPosition,
      this.moonRoverModel.position
    );
    const rightMiddlePivotA = new THREE.Vector3().subVectors(
      this.wheelRMPosition,
      this.moonRoverModel.position
    );
    const leftBackPivotA = new THREE.Vector3().subVectors(
      this.wheelLBPosition,
      this.moonRoverModel.position
    );
    const rightBackPivotA = new THREE.Vector3().subVectors(
      this.wheelRBPosition,
      this.moonRoverModel.position
    );

    // Add wheels constraint
    // left front wheel constraint
    this.constraintLF = new CANNON.HingeConstraint(
      this.moonRoverBody,
      this.wheelLFBody,
      {
        pivotA: leftFrontPivotA,
        axisA: leftFrontAxis,
        maxForce: 0.99,
      }
    );
    this.physicsWorld.addConstraint(this.constraintLF);
    // right front wheel constraint
    this.constraintRF = new CANNON.HingeConstraint(
      this.moonRoverBody,
      this.wheelRFBody,
      {
        pivotA: rightFrontPivotA,
        axisA: rightFrontAxis,
        maxForce: 0.99,
      }
    );
    this.physicsWorld.addConstraint(this.constraintRF);
    // left middle wheel constraint
    this.constraintLM = new CANNON.HingeConstraint(
      this.moonRoverBody,
      this.wheelLMBody,
      {
        pivotA: leftMiddlePivotA,
        axisA: leftMiddleAxis,
        maxForce: 0.99,
      }
    );
    this.physicsWorld.addConstraint(this.constraintLM);
    // right middle wheel constraint
    this.constraintRM = new CANNON.HingeConstraint(
      this.moonRoverBody,
      this.wheelRMBody,
      {
        pivotA: rightMiddlePivotA,
        axisA: rightMiddleAxis,
        maxForce: 0.99,
      }
    );
    this.physicsWorld.addConstraint(this.constraintRM);
    // left back wheel constraint
    this.constraintLB = new CANNON.HingeConstraint(
      this.moonRoverBody,
      this.wheelLBBody,
      {
        pivotA: leftBackPivotA,
        axisA: leftBackAxis,
        maxForce: 0.99,
      }
    );
    this.physicsWorld.addConstraint(this.constraintLB);
    // right back wheel constraint
    this.constraintRB = new CANNON.HingeConstraint(
      this.moonRoverBody,
      this.wheelRBBody,
      {
        pivotA: rightBackPivotA,
        axisA: rightBackAxis,
        maxForce: 0.99,
      }
    );
    this.physicsWorld.addConstraint(this.constraintRB);

    // Front and back wheels drive
    this.constraintLF.enableMotor();
    this.constraintRF.enableMotor();
    // this.constraintLM.enableMotor();
    // this.constraintRM.enableMotor();
    this.constraintLB.enableMotor();
    this.constraintRB.enableMotor();

    // Turning wheels
    this.constraintLF.axisA.y = this.turningAngle;
    this.constraintRF.axisA.y = this.turningAngle;
    this.constraintLB.axisA.y = -this.turningAngle;
    this.constraintRB.axisA.y = -this.turningAngle;

    // Apply moon rover moter speed
    this.constraintLF.setMotorSpeed(this.forwardSpeed);
    this.constraintRF.setMotorSpeed(this.forwardSpeed);
    // this.constraintLM.setMotorSpeed(this.forwardSpeed/10);
    // this.constraintRM.setMotorSpeed(this.forwardSpeed/10);
    this.constraintLB.setMotorSpeed(this.forwardSpeed);
    this.constraintRB.setMotorSpeed(this.forwardSpeed);
  }

  // Set up the moon lander physics
  setMoonLanderPhysics() {
    // Initial setups
    const moonLanderMass = 1;
    const moonLanderPositionX = 0;
    const moonLanderPositionY = -7;
    const moonLanderPositionZ = -15;

    // Add moon lander body
    const moonLanderShape1 = new CANNON.Box(new CANNON.Vec3(1.2, 0.8, 1.2));
    const moonLanderShape2 = new CANNON.Box(new CANNON.Vec3(3.2, 0.2, 1));
    const moonLanderShape3 = new CANNON.Box(new CANNON.Vec3(0.5, 0.1, 1.5));
    const moonLanderSupport = new CANNON.Sphere(0.4);
    this.moonLanderBody = new CANNON.Body({
      mass: moonLanderMass,
      material: this.defaultContactMaterial,
    });
    this.moonLanderBody.addShape(moonLanderShape1);
    this.moonLanderBody.addShape(moonLanderShape2, new CANNON.Vec3(0, 0.2, 0));
    this.moonLanderBody.addShape(
      moonLanderShape3,
      new CANNON.Vec3(0, -1.05, 2.5),
      new CANNON.Quaternion().setFromAxisAngle(
        new CANNON.Vec3(1, 0, 0),
        Math.PI / 8
      )
    );
    this.moonLanderBody.addShape(
      moonLanderSupport,
      new CANNON.Vec3(2.05, -1.25, 0)
    );
    this.moonLanderBody.addShape(
      moonLanderSupport,
      new CANNON.Vec3(-2.05, -1.25, 0)
    );
    this.moonLanderBody.addShape(
      moonLanderSupport,
      new CANNON.Vec3(0, -1.25, 2.05)
    );
    this.moonLanderBody.addShape(
      moonLanderSupport,
      new CANNON.Vec3(0, -1.25, -2.05)
    );

    // Move moon lander position
    this.moonLanderBody.position.set(
      moonLanderPositionX,
      moonLanderPositionY,
      moonLanderPositionZ
    );

    // Rotate moon lander to land on planet
    this.moonLanderBody.quaternion.setFromVectors(
      this.upAxis,
      this.moonLanderBody.position
    );

    this.physicsWorld.addBody(this.moonLanderBody);
  }

  // Set up the moon satellite physics
  setMoonSatellitePhysics() {
    // Initial setups
    const moonSatelliteMass = 0;
    const moonSatellitePositionX = -20;
    const moonSatellitePositionY = 30;
    const moonSatellitePositionZ = -50;

    // Add moon satellite body
    const moonSatelliteShape1 = new CANNON.Box(new CANNON.Vec3(0.5, 0.3, 0.5));
    const moonSatelliteShape2 = new CANNON.Box(new CANNON.Vec3(2.8, 0.1, 0.5));
    const moonSatelliteShape3 = new CANNON.Cylinder(0.1, 2, 1);
    const moonSatelliteShape4 = new CANNON.Cylinder(0.2, 0.2, 1.5);
    this.moonSatelliteBody = new CANNON.Body({
      mass: moonSatelliteMass,
      material: this.defaultContactMaterial,
    });
    this.moonSatelliteBody.addShape(moonSatelliteShape1);
    this.moonSatelliteBody.addShape(moonSatelliteShape2);
    this.moonSatelliteBody.addShape(
      moonSatelliteShape3,
      new CANNON.Vec3(0, -0.5, 0)
    );
    this.moonSatelliteBody.addShape(
      moonSatelliteShape4,
      new CANNON.Vec3(0, -1.5, 0)
    );

    // Move moon satellite position
    this.moonSatelliteBody.position.set(
      moonSatellitePositionX,
      moonSatellitePositionY,
      moonSatellitePositionZ
    );

    // Rotate moon satellite to face to planet
    this.moonSatelliteBody.quaternion.setFromVectors(
      this.upAxis,
      this.moonSatelliteBody.position
    );

    this.physicsWorld.addBody(this.moonSatelliteBody);
  }

  // Set up the UFO physics
  setUFOPhysics() {
    // Initial setups
    const ufoMass = 1;
    const ufoPositionX = 0;
    const ufoPositionY = -17;
    const ufoPositionZ = 0;

    // Add UFO body
    const ufoShape = new CANNON.Cylinder(2.8, 2.8, 0.5);
    const supportShape1 = new CANNON.Sphere(0.5);
    const supportShape2 = new CANNON.Sphere(0.9);

    this.ufoBody = new CANNON.Body({
      mass: ufoMass,
      material: this.defaultContactMaterial,
    });

    this.ufoBody.addShape(ufoShape);
    this.ufoBody.addShape(supportShape1, new CANNON.Vec3(2, -0.2, 0));
    this.ufoBody.addShape(supportShape1, new CANNON.Vec3(-1, -0.2, 1.75));
    this.ufoBody.addShape(supportShape1, new CANNON.Vec3(-1, -0.2, -1.75));
    this.ufoBody.addShape(supportShape2, new CANNON.Vec3(0, 0.4, 0));

    // Move UFO position
    this.ufoBody.position.set(ufoPositionX, ufoPositionY, ufoPositionZ);

    // Rotate UFO to face to planet
    this.ufoBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI);

    this.physicsWorld.addBody(this.ufoBody);
  }

  /**
   * Physics update
   */
  update() {
    /**
     * Moon rover physics update
     */
    // Update moon rover physics
    this.moonRoverModel.position.copy(this.moonRoverBody.position);
    this.moonRoverModel.quaternion.copy(this.moonRoverBody.quaternion);
    // Update left front wheel physics
    this.wheelLFMesh.position.copy(this.wheelLFBody.position);
    this.wheelLFMesh.quaternion.copy(this.wheelLFBody.quaternion);
    // Update right front wheel physics
    this.wheelRFMesh.position.copy(this.wheelRFBody.position);
    this.wheelRFMesh.quaternion.copy(this.wheelRFBody.quaternion);
    // Update left middle wheel physics
    this.wheelLMMesh.position.copy(this.wheelLMBody.position);
    this.wheelLMMesh.quaternion.copy(this.wheelLMBody.quaternion);
    // Update right middle wheel physics
    this.wheelRMMesh.position.copy(this.wheelRMBody.position);
    this.wheelRMMesh.quaternion.copy(this.wheelRMBody.quaternion);
    // Update left back wheel physics
    this.wheelLBMesh.position.copy(this.wheelLBBody.position);
    this.wheelLBMesh.quaternion.copy(this.wheelLBBody.quaternion);
    // Update right back wheel physics
    this.wheelRBMesh.position.copy(this.wheelRBBody.position);
    this.wheelRBMesh.quaternion.copy(this.wheelRBBody.quaternion);

    /**
     * Moon lander physics update
     */
    this.moonLanderModel.position.copy(this.moonLanderBody.position);
    this.moonLanderModel.quaternion.copy(this.moonLanderBody.quaternion);

    /**
     * Moon satellite physics update
     */
    this.moonSatelliteModel.position.copy(this.moonSatelliteBody.position);
    this.moonSatelliteModel.quaternion.copy(this.moonSatelliteBody.quaternion);

    /**
     * UFO physics update
     */
    this.ufoModel.position.copy(this.ufoBody.position);
    this.ufoModel.quaternion.copy(this.ufoBody.quaternion);
  }
}
