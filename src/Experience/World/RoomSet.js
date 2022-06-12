import * as THREE from "three";
import * as CANNON from "cannon-es";
import Experience from "../Experience";

export default class RoomSet {
  constructor(defaultMaterial, physicsWorld, applyRotation) {
    // Setups
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;
    this.camera = this.experience.camera;
    this.defaultMaterial = defaultMaterial;
    this.physicsWorld = physicsWorld;
    this.upAxis = new CANNON.Vec3(0, 1, 0);
    this.applyRotation = applyRotation;

    // Table materials and textures setup
    this.tableTopMaterial = new THREE.MeshMatcapMaterial();
    this.monitorScreenMaterial = new THREE.MeshBasicMaterial();
    this.tableDrawerMaterial = new THREE.MeshMatcapMaterial();
    this.tableTopTexture = this.resources.items.tableTopMatcapTexture;
    this.tableDrawerTexture = this.resources.items.tableDrawerMatcapTexture;
    this.tableTopTexture.encoding = THREE.sRGBEncoding;
    this.tableDrawerTexture.encoding = THREE.sRGBEncoding;

    this.monitorScreenTexture = this.resources.items.monitorScreenTexture;
    this.monitorScreenTexture.encoding = THREE.sRGBEncoding;
    this.monitorScreenTexture.generateMipmaps = false;
    this.monitorScreenTexture.minFilter = THREE.NearestFilter;

    // Laptop materials and textures setup
    this.laptopMaterial = new THREE.MeshMatcapMaterial();
    this.laptopScreenMaterial = new THREE.MeshBasicMaterial();
    this.keyboardMaterial = new THREE.MeshMatcapMaterial();
    this.laptopTexture = this.resources.items.tableDrawerMatcapTexture;
    this.keyboardTexture = this.resources.items.tableTopMatcapTexture;
    this.laptopTexture.encoding = THREE.sRGBEncoding;
    this.keyboardTexture.encoding = THREE.sRGBEncoding;

    this.laptopScreenTexture = this.resources.items.laptopScreenTexture;
    this.laptopScreenTexture.encoding = THREE.sRGBEncoding;
    this.laptopScreenTexture.generateMipmaps = false;
    this.laptopScreenTexture.minFilter = THREE.NearestFilter;

    // Chair materials and textures setup
    this.chairMaterial = new THREE.MeshMatcapMaterial();
    this.chairLegMaterial = new THREE.MeshMatcapMaterial();
    this.chairTexture = this.resources.items.tableDrawerMatcapTexture;
    this.chairLegTexture = this.resources.items.tableTopMatcapTexture;
    this.chairTexture.encoding = THREE.sRGBEncoding;
    this.chairLegTexture.encoding = THREE.sRGBEncoding;

    // Speaker materials and textures setup
    this.speakerMaterial = new THREE.MeshMatcapMaterial();
    this.speakerTopMaterial = new THREE.MeshMatcapMaterial();
    this.speakerTexture = this.resources.items.tableTopMatcapTexture;
    this.speakerTopTexture = this.resources.items.tableTopMatcapTexture;
    this.speakerTexture.encoding = THREE.sRGBEncoding;
    this.speakerTopTexture.encoding = THREE.sRGBEncoding;

    // Photo frame materials and textures setup
    this.picFrameMaterial = new THREE.MeshMatcapMaterial();
    this.picMaterial = new THREE.MeshBasicMaterial();
    this.picFrameTexture = this.resources.items.woodMatcapTexture;
    this.picTexture = this.resources.items.picTexture;
    this.picTexture.encoding = THREE.sRGBEncoding;
    this.picTexture.generateMipmaps = false;
    this.picTexture.minFilter = THREE.NearestFilter;

    // Mug materials and textures setup
    this.mugMaterial = new THREE.MeshMatcapMaterial();
    this.mugTextMaterial = new THREE.MeshMatcapMaterial();
    this.mugTexture = this.resources.items.mugMatcapTexture;
    this.mugTextTexture = this.resources.items.astronautBodyMatcapTexture;
    this.mugTexture.encoding = THREE.sRGBEncoding;
    this.mugTextTexture.encoding = THREE.sRGBEncoding;

    // Telescope materials and textures setup
    this.telescopeMaterial = new THREE.MeshMatcapMaterial();
    this.telescopeDarkMaterial = new THREE.MeshMatcapMaterial();
    this.telescopeTexture = this.resources.items.astronautBodyMatcapTexture;
    this.telescopeDarkTexture = this.resources.items.tableTopMatcapTexture;
    this.telescopeTexture.encoding = THREE.sRGBEncoding;
    this.telescopeDarkTexture.encoding = THREE.sRGBEncoding;

    // Sofa materials and textures setup
    this.sofaMaterial = new THREE.MeshMatcapMaterial();
    this.sofaLegMaterial = new THREE.MeshMatcapMaterial();
    this.sofaPillowMaterial = new THREE.MeshMatcapMaterial();
    this.sofaTexture = this.resources.items.sofaMatcapTexture;
    this.sofaLegTexture = this.resources.items.astronautTrimMatcapTexture;
    this.sofaPillowTexture = this.resources.items.sofaPillowMatcapTexture;
    this.sofaTexture.encoding = THREE.sRGBEncoding;
    this.sofaLegTexture.encoding = THREE.sRGBEncoding;
    this.sofaPillowTexture.encoding = THREE.sRGBEncoding;

    // TV bench materials and textures setup
    this.tvBenchLightMaterial = new THREE.MeshMatcapMaterial();
    this.tvBenchDarkMaterial = new THREE.MeshMatcapMaterial();
    this.tvBenchLegMaterial = new THREE.MeshMatcapMaterial();
    this.tvBenchLightTexture = this.resources.items.astronautBodyMatcapTexture;
    this.tvBenchDarkTexture = this.resources.items.tableTopMatcapTexture;
    this.tvBenchLegTexture = this.resources.items.woodMatcapTexture;
    this.tvBenchLightTexture.encoding = THREE.sRGBEncoding;
    this.tvBenchDarkTexture.encoding = THREE.sRGBEncoding;
    this.tvBenchLegTexture.encoding = THREE.sRGBEncoding;

    // TV materials and textures setup
    this.tvMaterial = new THREE.MeshMatcapMaterial();
    this.tvScreenMaterial = new THREE.MeshBasicMaterial();
    this.tvTexture = this.resources.items.tableTopMatcapTexture;
    this.tvTexture.encoding = THREE.sRGBEncoding;

    // Switch materials and textures setup
    this.switchMaterial = new THREE.MeshMatcapMaterial();
    this.switchBlueMaterial = new THREE.MeshMatcapMaterial();
    this.switchRedMaterial = new THREE.MeshMatcapMaterial();
    this.switchTexture = this.resources.items.tableTopMatcapTexture;
    this.switchBlueTexture = this.resources.items.switchBlueMatcapTexture;
    this.switchRedTexture = this.resources.items.switchRedMatcapTexture;
    this.switchTexture.encoding = THREE.sRGBEncoding;
    this.switchBlueTexture.encoding = THREE.sRGBEncoding;
    this.switchRedTexture.encoding = THREE.sRGBEncoding;

    // Diffuser materials and textures setup
    this.glassMaterial = new THREE.MeshMatcapMaterial();
    this.liquidMaterial = new THREE.MeshMatcapMaterial();
    this.stickMaterial = new THREE.MeshMatcapMaterial();
    this.glassTexture = this.resources.items.astronautBodyMatcapTexture;
    this.liquidTexture = this.resources.items.moonMatcapTexture;
    this.stickTexture = this.resources.items.woodMatcapTexture;
    this.glassTexture.encoding = THREE.sRGBEncoding;
    this.liquidTexture.encoding = THREE.sRGBEncoding;
    this.stickTexture.encoding = THREE.sRGBEncoding;

    // Lego car materials and textures setup
    this.legoWhiteMaterial = new THREE.MeshMatcapMaterial();
    this.legoBlueMaterial = new THREE.MeshMatcapMaterial();
    this.legoDarkBlueMaterial = new THREE.MeshMatcapMaterial();
    this.legoGrayMaterial = new THREE.MeshMatcapMaterial();
    this.legoRedMaterial = new THREE.MeshMatcapMaterial();
    this.legoWhiteTexture = this.resources.items.astronautBodyMatcapTexture;
    this.legoBlueTexture = this.resources.items.switchBlueMatcapTexture;
    this.legoDarkBlueTexture = this.resources.items.legoDarkBlueMatcapTexture;
    this.legoGaryTexture = this.resources.items.mugMatcapTexture;
    this.legoRedTexture = this.resources.items.legoRedMatcapTexture;
    this.legoWhiteTexture.encoding = THREE.sRGBEncoding;
    this.legoBlueTexture.encoding = THREE.sRGBEncoding;
    this.legoDarkBlueTexture.encoding = THREE.sRGBEncoding;
    this.legoGaryTexture.encoding = THREE.sRGBEncoding;
    this.legoRedTexture.encoding = THREE.sRGBEncoding;

    // Projects shelf textures and pictures
    this.project001Material = new THREE.MeshBasicMaterial();
    this.project002Material = new THREE.MeshBasicMaterial();
    this.project003Material = new THREE.MeshBasicMaterial();
    this.project004Material = new THREE.MeshBasicMaterial();
    this.chromeMaterial = new THREE.MeshMatcapMaterial();
    this.chromeTextures = this.resources.items.planetLandMatcapTexture;
    this.chromeYellowMaterial = new THREE.MeshMatcapMaterial();
    this.chromeYellowTextures = this.resources.items.moonMatcapTexture;
    this.chromeGreenMaterial = new THREE.MeshMatcapMaterial();
    this.chromeGreenTextures = this.resources.items.treeMatcapTexture;
    this.chromeYellowTextures.encoding = THREE.sRGBEncoding;

    this.project001Texture = this.resources.items.project001Texture;
    this.project001Texture.encoding = THREE.sRGBEncoding;
    this.project001Texture.generateMipmaps = false;
    this.project001Texture.minFilter = THREE.NearestFilter;
    this.project002Texture = this.resources.items.project002Texture;
    this.project002Texture.encoding = THREE.sRGBEncoding;
    this.project002Texture.generateMipmaps = false;
    this.project002Texture.minFilter = THREE.NearestFilter;
    this.project003Texture = this.resources.items.project003Texture;
    this.project003Texture.encoding = THREE.sRGBEncoding;
    this.project003Texture.generateMipmaps = false;
    this.project003Texture.minFilter = THREE.NearestFilter;
    this.project004Texture = this.resources.items.project004Texture;
    this.project004Texture.encoding = THREE.sRGBEncoding;
    this.project004Texture.generateMipmaps = false;
    this.project004Texture.minFilter = THREE.NearestFilter;

    // Table model and physics
    this.setTable();
    this.setTablePhysics();

    // Laptop model and physics
    this.setLaptop();
    this.setLaptopPhysics();

    // Chair model and physics
    this.setChair();
    this.setChairPhysics();

    // Speaker model and physics
    this.setSpeaker();
    this.setSpeakerPhysics();

    // Picture frame model and physics
    this.setPicFrame();
    this.setPicFramePhysics();

    // Mug model and physics
    this.setMug();
    this.setMugPhysics();

    // Telescope model and physics
    this.setTelescope();
    this.setTelescopePhysics();

    // Sofa model and physics
    this.setSofa();
    this.setSofaPhysics();

    // TV bench model and physics
    this.setTVBench();
    this.setTVBenchPhysics();

    // TV model and physics
    this.setTV();
    this.setTVPhysics();

    // Switch model and physics
    this.setSwitch();
    this.setSwitchPhysics();

    // Diffuser model and physics
    this.setDiffuser();
    this.setDiffuserPhysics();

    // Shelf model and physics
    this.setShelf();
    this.setShelfPhysics();

    // Lego car model and physics
    this.setLego();
    this.setLegoPhysics();
  }

  /**
   * ThreeJS setups
   */
  // Set up the table
  setTable() {
    this.tableModel = this.resources.items.tableModel.scene;
    this.tableModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "tableTop" || child.name === "monitor") {
          child.material = this.tableTopMaterial;
          this.tableTopMaterial.matcap = this.tableTopTexture;
        }
        if (
          child.name === "tableDrawer" ||
          child.name === "tableLeg" ||
          child.name === "monitorArm"
        ) {
          child.material = this.tableDrawerMaterial;
          this.tableDrawerMaterial.matcap = this.tableDrawerTexture;
        }
        if (child.name === "monitorScreen") {
          child.geometry = new THREE.PlaneGeometry(10, 4.9);
          child.material = this.monitorScreenMaterial;
          child.material.map = this.monitorScreenTexture;
          child.rotation.y = -Math.PI / 2;
          child.position.x = 0.665;
        }
      }
    });
    this.scene.add(this.tableModel);
  }

  // Set up the laptop
  setLaptop() {
    // set up new screen position and rotation separately due to the shape of the model
    this.laptopGroup = new THREE.Group();
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.98, 0.69),
      this.laptopScreenMaterial
    );
    this.laptopScreenMaterial.map = this.laptopScreenTexture;
    screen.rotation.set(-Math.PI / 2, -1.4, -Math.PI / 2);
    screen.position.set(0.428, 0.35, 0);
    this.laptopGroup.add(screen);

    // set up the laptop model
    this.laptopModel = this.resources.items.laptopModel.scene;
    this.laptopModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "laptop") {
          child.material = this.laptopMaterial;
          this.laptopMaterial.matcap = this.laptopTexture;
        }
        if (child.name === "screen") {
          child.material.transparent = true;
          child.material.opacity = 0;
        }
        if (
          child.name === "keyboard" ||
          child.name === "screenFrame" ||
          child.name === "trackpadFrame"
        ) {
          child.material = this.keyboardMaterial;
          this.keyboardMaterial.matcap = this.keyboardTexture;
        }
      }
    });
    this.laptopGroup.add(this.laptopModel);
    this.scene.add(this.laptopGroup);
  }

  // Set up the chair
  setChair() {
    this.chairModel = this.resources.items.chairModel.scene;
    this.chairModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "chair" || child.name === "armPadding") {
          child.material = this.chairMaterial;
          this.chairMaterial.matcap = this.chairTexture;
        }
        if (child.name === "chairLeg" || child.name === "chairArm") {
          child.material = this.chairLegMaterial;
          this.chairLegMaterial.matcap = this.chairLegTexture;
        }
      }
    });
    this.scene.add(this.chairModel);
  }

  // Set up the speaker
  setSpeaker() {
    this.speakerModel = this.resources.items.speakerModel.scene;
    this.speakerModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "speaker") {
          child.material = this.speakerMaterial;
          this.speakerMaterial.matcap = this.speakerTexture;
        }
        if (child.name === "speakerTop") {
          child.material = this.speakerTopMaterial;
          this.speakerTopMaterial.matcap = this.speakerTopTexture;
          this.speakerTopMaterial.transparent = true;
          this.speakerTopMaterial.opacity = 0.5;
        }
      }
    });
    this.scene.add(this.speakerModel);
  }

  // Set up the photo frame
  setPicFrame() {
    // set up a picture plane to match the frame position and rotation
    this.picFrameGroup = new THREE.Group();
    const picture = new THREE.Mesh(
      new THREE.PlaneGeometry(0.42, 0.58),
      this.picMaterial
    );
    picture.rotation.set(-Math.PI / 2, -1.225, -Math.PI / 2);
    picture.position.set(-0.02, 0.02, 0);

    this.picMaterial.map = this.picTexture;
    this.picFrameGroup.add(picture);

    this.picFrameModel = this.resources.items.picFrameModel.scene;
    this.picFrameModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "picFrame") {
          child.material = this.picFrameMaterial;
          this.picFrameMaterial.matcap = this.picFrameTexture;
        }
        if (child.name === "pic") {
          child.material.transparent = true;
          child.material.opacity = 0;
        }
      }
    });
    this.picFrameGroup.add(this.picFrameModel);
    this.scene.add(this.picFrameGroup);
  }

  // Set up the mug
  setMug() {
    this.mugModel = this.resources.items.mugModel.scene;
    this.mugModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "mug") {
          child.material = this.mugMaterial;
          this.mugMaterial.matcap = this.mugTexture;
        }
        if (child.name === "text") {
          child.material = this.mugTextMaterial;
          this.mugTextMaterial.matcap = this.mugTextTexture;
        }
      }
    });
    this.scene.add(this.mugModel);
  }

  // Set up the telescope
  setTelescope() {
    this.telescopeModel = this.resources.items.telescopeModel.scene;
    this.telescopeModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "telescopeLight") {
          child.material = this.telescopeMaterial;
          this.telescopeMaterial.matcap = this.telescopeTexture;
        }
        if (child.name === "telescopeDark" || child.name === "telescopeLeg") {
          child.material = this.telescopeDarkMaterial;
          this.telescopeDarkMaterial.matcap = this.telescopeDarkTexture;
        }
      }
    });
    this.scene.add(this.telescopeModel);
  }

  // Set up the sofa
  setSofa() {
    this.sofaModel = this.resources.items.sofaModel.scene;
    this.sofaPillowModel = this.resources.items.sofaPillowModel.scene;

    this.pillowNumebr = 2;
    this.sofaPillowSet = [];

    this.sofaModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "sofa") {
          child.material = this.sofaMaterial;
          this.sofaMaterial.matcap = this.sofaTexture;
        }
        if (child.name === "sofaLeg") {
          child.material = this.sofaLegMaterial;
          this.sofaLegMaterial.matcap = this.sofaLegTexture;
        }
      }
    });
    this.scene.add(this.sofaModel);

    for (let i = 0; i < this.pillowNumebr; i++) {
      this.sofaPillowSet[i] =
        this.resources.items.sofaPillowModel.scene.clone();
      this.sofaPillowSet[i].traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.name === "sofaPillow001") {
            child.material = this.sofaPillowMaterial;
            this.sofaPillowMaterial.matcap = this.sofaPillowTexture;
          }
        }
      });
      this.scene.add(this.sofaPillowSet[i]);
    }
  }

  // Set up the TV bench
  setTVBench() {
    this.tvBenchModel = this.resources.items.tvBenchModel.scene;
    this.tvBenchModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "TVBenchLight") {
          child.material = this.tvBenchLightMaterial;
          this.tvBenchLightMaterial.matcap = this.tvBenchLightTexture;
        }
        if (child.name === "TVBenchDark") {
          child.material = this.tvBenchDarkMaterial;
          this.tvBenchDarkMaterial.matcap = this.tvBenchDarkTexture;
        }
        if (child.name === "TVBenchLeg") {
          child.material = this.tvBenchLegMaterial;
          this.tvBenchLegMaterial.matcap = this.tvBenchLegTexture;
        }
      }
    });
    this.scene.add(this.tvBenchModel);
  }

  // Set up the TV
  setTV() {
    this.tvScreenRender = this.experience.renderer.tvScreenRender;

    this.tvModel = this.resources.items.tvModel.scene;
    this.tvModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (
          child.name === "TV" ||
          child.name === "TVLeg001" ||
          child.name === "TVLeg002"
        ) {
          child.material = this.tvMaterial;
          this.tvMaterial.matcap = this.tvTexture;
        }
        if (child.name === "TVScreen") {
          child.geometry = new THREE.PlaneGeometry(3.9, 2.35);
          child.material = this.tvScreenMaterial;
          child.material.map = this.tvScreenRender.texture;
          child.rotation.y = -Math.PI / 2;
          child.position.x = -0.03;
        }
      }
    });
    this.scene.add(this.tvModel);
  }

  // Set up the switch
  setSwitch() {
    this.switchModel = this.resources.items.switchModel.scene;
    this.switchModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "switch" || child.name === "button") {
          child.material = this.switchMaterial;
          this.switchMaterial.matcap = this.switchTexture;
        }
      }
      if (child instanceof THREE.Mesh) {
        if (child.name === "controllerBlue") {
          child.material = this.switchBlueMaterial;
          this.switchBlueMaterial.matcap = this.switchBlueTexture;
        }
      }
      if (child instanceof THREE.Mesh) {
        if (child.name === "controllerRed") {
          child.material = this.switchRedMaterial;
          this.switchRedMaterial.matcap = this.switchRedTexture;
        }
      }
    });
    this.scene.add(this.switchModel);
  }

  // Set up the diffuser
  setDiffuser() {
    this.diffuserModel = this.resources.items.diffuserModel.scene;
    this.diffuserModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "glass") {
          child.material = this.glassMaterial;
          this.glassMaterial.matcap = this.glassTexture;
        }
      }
      if (child instanceof THREE.Mesh) {
        if (child.name === "liquid") {
          child.material = this.liquidMaterial;
          this.liquidMaterial.matcap = this.liquidTexture;
          this.liquidMaterial.transparent = true;
          this.liquidMaterial.opacity = 0.7;
        }
      }
      if (child instanceof THREE.Mesh) {
        if (child.name === "stick") {
          child.material = this.stickMaterial;
          this.stickMaterial.matcap = this.stickTexture;
        }
      }
    });
    this.scene.add(this.diffuserModel);
  }

  // Set up the shelf
  setShelf() {
    this.shelfGroup = new THREE.Group();
    this.shelfModel = this.resources.items.shelfModel.scene;
    this.project001Model = this.resources.items.project001Model.scene;
    this.project002Model = this.resources.items.project002Model.scene;
    this.project003Model = this.resources.items.project003Model.scene;
    this.project004Model = this.resources.items.project004Model.scene;

    // At camera viewing position box
    this.shelfCamPosition = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      new THREE.MeshBasicMaterial({
        transparent: true,
        // opacity: 0,
      })
    );
    this.shelfCamPosition.position.z = -5;

    // Shelf mesh setups
    this.shelfModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "shelf") {
          child.material = this.tableTopMaterial;
          this.tableTopMaterial.matcap = this.tableTopTexture;
        }
        if (child.name === "box") {
          child.material = this.mugTextMaterial;
          this.tableTopMaterial.matcap = this.mugTextTexture;
        }
      }
    });
    // Project001 mesh setups
    this.project001Model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "chrome") {
          child.material = this.chromeMaterial;
          this.chromeMaterial.matcap = this.chromeTextures;
        }
        if (child.name === "jsText") {
          child.material = this.picFrameMaterial;
        }
        if (child.name === "threejsText") {
          child.material = this.switchBlueMaterial;
        }
        if (child.name === "chromeRed") {
          child.material = this.legoRedMaterial;
          this.tableTopMaterial.matcap = this.legoRedTexture;
        }
        if (child.name === "chromeYellow") {
          child.material = this.chromeYellowMaterial;
          this.chromeYellowMaterial.matcap = this.chromeYellowTextures;
        }
        if (child.name === "chromeGreen") {
          child.material = this.chromeGreenMaterial;
          this.chromeGreenMaterial.matcap = this.chromeGreenTextures;
        }
        if (child.name === "projectPic") {
          child.material = this.project001Material;
          child.material.map = this.project001Texture;
        }
      }
    });
    // Project002 mesh setups
    this.project002Model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "chrome001") {
          child.material = this.chromeMaterial;
        }
        if (child.name === "jsText001") {
          child.material = this.picFrameMaterial;
        }
        if (child.name === "threejsText001") {
          child.material = this.switchBlueMaterial;
        }
        if (child.name === "chromeRed001" || child.name === "blenderText001") {
          child.material = this.legoRedMaterial;
        }
        if (child.name === "chromeYellow001") {
          child.material = this.chromeYellowMaterial;
        }
        if (child.name === "chromeGreen001") {
          child.material = this.chromeGreenMaterial;
        }
        if (child.name === "projectPic001") {
          child.material = this.project002Material;
          child.material.map = this.project002Texture;
        }
      }
    });
    // Project003 mesh setups
    this.project003Model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "chrome002") {
          child.material = this.chromeMaterial;
        }
        if (child.name === "chromeRed002" || child.name === "blenderText002") {
          child.material = this.legoRedMaterial;
        }
        if (child.name === "chromeYellow002") {
          child.material = this.chromeYellowMaterial;
        }
        if (child.name === "chromeGreen002") {
          child.material = this.chromeGreenMaterial;
        }
        if (child.name === "projectPic002") {
          child.material = this.project003Material;
          child.material.map = this.project003Texture;
        }
      }
    });
    // Project004 mesh setups
    this.project004Model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "chrome003") {
          child.material = this.chromeMaterial;
        }
        if (child.name === "chromeRed003" || child.name === "blenderText003") {
          child.material = this.legoRedMaterial;
        }
        if (child.name === "chromeYellow003") {
          child.material = this.chromeYellowMaterial;
        }
        if (child.name === "chromeGreen003") {
          child.material = this.chromeGreenMaterial;
        }
        if (child.name === "projectPic003") {
          child.material = this.project004Material;
          child.material.map = this.project004Texture;
        }
      }
    });

    this.shelfGroup.add(this.shelfModel);
    this.shelfGroup.add(this.project001Model);
    this.shelfGroup.add(this.project002Model);
    this.shelfGroup.add(this.project003Model);
    this.shelfGroup.add(this.project004Model);
    this.shelfGroup.add(this.shelfCamPosition);
    this.scene.add(this.shelfGroup);
  }

  // Set up the lego
  setLego() {
    this.legoModel = this.resources.items.legoModel.scene;
    this.legoModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "black003") {
          child.material = this.tableTopMaterial;
          this.tableTopMaterial.matcap = this.tableTopTexture;
        }
      }
      if (child instanceof THREE.Mesh) {
        if (child.name === "white") {
          child.material = this.legoWhiteMaterial;
          this.legoWhiteMaterial.matcap = this.legoWhiteTexture;
        }
      }
      if (child instanceof THREE.Mesh) {
        if (child.name === "gray") {
          child.material = this.legoGrayMaterial;
          this.legoGrayMaterial.matcap = this.legoGaryTexture;
        }
      }
      if (child instanceof THREE.Mesh) {
        if (child.name === "blue") {
          child.material = this.legoBlueMaterial;
          this.legoBlueMaterial.matcap = this.legoBlueTexture;
        }
      }
      if (child instanceof THREE.Mesh) {
        if (child.name === "darkBlue") {
          child.material = this.legoDarkBlueMaterial;
          this.legoDarkBlueMaterial.matcap = this.legoDarkBlueTexture;
        }
      }
      if (child instanceof THREE.Mesh) {
        if (child.name === "red") {
          child.material = this.legoRedMaterial;
          this.legoRedMaterial.matcap = this.legoRedTexture;
        }
      }
    });
    this.scene.add(this.legoModel);
  }

  /**
   * Physics setup
   */
  // Set up the table physics
  setTablePhysics() {
    const tableTopShape = new CANNON.Box(new CANNON.Vec3(1, 0.05, 2));
    const tableDrawerShape = new CANNON.Box(new CANNON.Vec3(1, 1, 0.5));
    const tableLegShape = new CANNON.Cylinder(0.1, 0.1, 2);
    const monitorShape = new CANNON.Box(new CANNON.Vec3(0.05, 0.5, 1));
    const monitorArmShape = new CANNON.Box(new CANNON.Vec3(0.05, 0.5, 0.2));
    const supportShape = new CANNON.Sphere(0.1);

    this.tableBody = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
    });
    this.tableBody.addShape(tableTopShape, new CANNON.Vec3(0, 1.05, 0));
    this.tableBody.addShape(tableDrawerShape, new CANNON.Vec3(0, 0, -1.5));
    this.tableBody.addShape(tableLegShape, new CANNON.Vec3(0.8, 0.1, 1.8));
    this.tableBody.addShape(tableLegShape, new CANNON.Vec3(-0.8, 0.1, 1.8));
    this.tableBody.addShape(monitorShape, new CANNON.Vec3(0.7, 2.2, 0));
    this.tableBody.addShape(monitorArmShape, new CANNON.Vec3(0.8, 1.6, -0.5));
    this.tableBody.addShape(supportShape, new CANNON.Vec3(0.8, -0.9, 1.8));
    this.tableBody.addShape(supportShape, new CANNON.Vec3(-0.8, -0.9, 1.8));
    this.tableBody.addShape(supportShape, new CANNON.Vec3(-0.8, -0.9, -1.8));
    this.tableBody.addShape(supportShape, new CANNON.Vec3(0.8, -0.9, -1.8));

    this.physicsWorld.addBody(this.tableBody);

    // set position for the table
    this.tableBody.position.x = 12.4;
    this.tableBody.position.y = 10;
    this.tableBody.quaternion.setFromVectors(
      this.upAxis,
      this.tableBody.position
    );
  }

  // Set up the laptop physics
  setLaptopPhysics() {
    const LaptopAShape = new CANNON.Box(new CANNON.Vec3(0.35, 0.05, 0.5));
    const LaptopBShape = new CANNON.Box(new CANNON.Vec3(0.35, 0.05, 0.5));

    this.laptopBody = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
    });
    this.laptopBody.addShape(
      LaptopAShape,
      new CANNON.Vec3(0.42, 0.35, 0),
      new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(0, 0, 1), 1.35)
    );
    this.laptopBody.addShape(LaptopBShape);

    this.physicsWorld.addBody(this.laptopBody);

    // set position for the laptop
    this.laptopBody.position.x = 13.05;
    this.laptopBody.position.y = 11;
    this.laptopBody.quaternion.setFromVectors(
      this.upAxis,
      this.laptopBody.position
    );
  }

  // Set up the chair physics
  setChairPhysics() {
    const chairShape = new CANNON.Box(new CANNON.Vec3(1, 0.2, 0.8));
    const chairBackShape = new CANNON.Box(new CANNON.Vec3(0.2, 1, 0.8));
    const chairLegShape = new CANNON.Cylinder(0.1, 1.2, 1);

    this.chairBody = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
    });
    this.chairBody.addShape(
      chairShape,
      new CANNON.Vec3(0, 0.3, 0),
      new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(0, 1, 0), 0)
    );
    this.chairBody.addShape(chairBackShape, new CANNON.Vec3(-0.8, 1.3, 0));
    this.chairBody.addShape(chairLegShape, new CANNON.Vec3(0, -0.5, 0));

    this.physicsWorld.addBody(this.chairBody);

    // set position for the chair
    this.chairBody.position.x = 10.5;
    this.chairBody.position.y = 12.5;
    this.chairBody.quaternion.setFromVectors(
      this.upAxis,
      this.chairBody.position
    );
  }

  // Set up the speaker physics
  setSpeakerPhysics() {
    const supportShape = new CANNON.Sphere(0.4);
    const speakerShape = new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 0.4));

    this.speakerBody = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
    });
    this.speakerBody.addShape(speakerShape, new CANNON.Vec3(0, 0.4, 0));
    this.speakerBody.addShape(supportShape, new CANNON.Vec3(0, 0.4, 0));

    this.physicsWorld.addBody(this.speakerBody);

    // set position for the speaker
    this.speakerBody.position.x = 13.45;
    this.speakerBody.position.y = 10.5;
    this.speakerBody.position.z = -1.5;
    this.speakerBody.quaternion.setFromVectors(
      this.upAxis,
      this.speakerBody.position
    );
  }

  // Set up picture frame physics
  setPicFramePhysics() {
    const supportShape = new CANNON.Sphere(0.2);
    const picFrameShape = new CANNON.Box(new CANNON.Vec3(0.2, 0.3, 0.25));

    this.picFrameBody = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
    });
    this.picFrameBody.addShape(picFrameShape);
    this.picFrameBody.addShape(supportShape);

    this.physicsWorld.addBody(this.picFrameBody);

    // set position for the photo frame
    this.picFrameBody.position.x = 13.8;
    this.picFrameBody.position.y = 10.5;
    this.picFrameBody.position.z = 1.5;
    this.picFrameBody.quaternion.setFromVectors(
      this.upAxis,
      this.picFrameBody.position
    );
  }

  // Set up mug physics
  setMugPhysics() {
    const supportShape = new CANNON.Sphere(0.25);
    const mugShape = new CANNON.Box(new CANNON.Vec3(0.2, 0.25, 0.2));

    this.mugBody = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
    });
    this.mugBody.addShape(mugShape);
    this.mugBody.addShape(supportShape);

    this.physicsWorld.addBody(this.mugBody);

    // set position for the mug
    this.mugBody.position.x = 13.15;
    this.mugBody.position.y = 11.2;
    this.mugBody.position.z = 1.2;
    this.mugBody.quaternion.setFromVectors(this.upAxis, this.mugBody.position);
  }

  // Set up telescope physics
  setTelescopePhysics() {
    const telescopeShape = new CANNON.Cylinder(0.4, 0.2, 2.6);
    const telescopeLegShape = new CANNON.Cylinder(0.2, 0.9, 2);

    this.telescopeBody = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
    });
    this.telescopeBody.addShape(
      telescopeShape,
      new CANNON.Vec3(0, 1.5, 0),
      this.applyRotation(1.2, 0, 0)
    );
    this.telescopeBody.addShape(telescopeLegShape);
    this.physicsWorld.addBody(this.telescopeBody);

    // set position for the telescope
    this.telescopeBody.position.x = 10.5;
    this.telescopeBody.position.y = 10;
    this.telescopeBody.position.z = 7;
    this.telescopeBody.quaternion.setFromVectors(
      this.upAxis,
      this.telescopeBody.position
    );
  }

  // Set up sofa physics
  setSofaPhysics() {
    // Create each sofa component shape
    const sofaShape1 = new CANNON.Box(new CANNON.Vec3(1.5, 0.6, 3));
    const sofaShape2 = new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 3));
    const sofaShape3 = new CANNON.Box(new CANNON.Vec3(1, 0.4, 0.4));
    const sofaLegShape = new CANNON.Sphere(0.2);
    const sofaPillowShape = new CANNON.Box(new CANNON.Vec3(0.7, 0.25, 0.7));

    // Create sofa physics body
    this.sofaBody = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
    });

    // Create pillows physics body
    this.sofaPillow001Body = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
    });
    this.sofaPillow002Body = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
    });

    // Add sofa body shapes
    this.sofaBody.addShape(sofaShape1, new CANNON.Vec3(0, -0.4, 0));
    this.sofaBody.addShape(sofaShape2, new CANNON.Vec3(-1.1, 0.6, 0));
    this.sofaBody.addShape(sofaShape3, new CANNON.Vec3(0.5, 0.6, 2.6));
    this.sofaBody.addShape(sofaShape3, new CANNON.Vec3(0.5, 0.6, -2.6));

    // Add sofa leg shapes
    this.sofaBody.addShape(sofaLegShape, new CANNON.Vec3(1.15, -1.15, 2.63));
    this.sofaBody.addShape(sofaLegShape, new CANNON.Vec3(1.15, -1.15, -2.63));
    this.sofaBody.addShape(sofaLegShape, new CANNON.Vec3(-1.15, -1.15, 2.63));
    this.sofaBody.addShape(sofaLegShape, new CANNON.Vec3(-1.15, -1.15, -2.63));

    // Add sofa pillow shapes
    this.sofaPillow001Body.addShape(sofaPillowShape);
    this.sofaPillow002Body.addShape(sofaPillowShape);

    // Add entire body shape to world
    this.physicsWorld.addBody(this.sofaBody);
    this.physicsWorld.addBody(this.sofaPillow001Body);
    this.physicsWorld.addBody(this.sofaPillow002Body);

    // set position for the sofa
    this.sofaBody.position.x = 17;
    this.sofaBody.quaternion.setFromVectors(
      this.upAxis,
      this.sofaBody.position
    );

    // set position for the pillows
    this.sofaPillow001Body.position.set(18.5, 0, 2);
    this.sofaPillow001Body.quaternion.setFromVectors(
      this.upAxis,
      this.sofaPillow001Body.position
    );

    this.sofaPillow002Body.position.set(18.5, -0.5, -2);
    this.sofaPillow002Body.quaternion.setFromVectors(
      this.upAxis,
      this.sofaPillow002Body.position
    );
  }

  // Set up TV bench physics
  setTVBenchPhysics() {
    this.tvBenchShape = new CANNON.Box(new CANNON.Vec3(1.1, 0.7, 3.5));
    this.tvBenchLegShape = new CANNON.Sphere(0.2);

    this.tvBenchBody = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
    });

    // Add TV bench body shape
    this.tvBenchBody.addShape(this.tvBenchShape);
    // Add TV bench leg shapes (X4)
    this.tvBenchBody.addShape(
      this.tvBenchLegShape,
      new CANNON.Vec3(0.68, -0.825, 3.01)
    );
    this.tvBenchBody.addShape(
      this.tvBenchLegShape,
      new CANNON.Vec3(-0.68, -0.825, 3.01)
    );
    this.tvBenchBody.addShape(
      this.tvBenchLegShape,
      new CANNON.Vec3(0.68, -0.825, -3.01)
    );
    this.tvBenchBody.addShape(
      this.tvBenchLegShape,
      new CANNON.Vec3(-0.68, -0.825, -3.01)
    );

    this.physicsWorld.addBody(this.tvBenchBody);

    // set position for the TV bench
    this.tvBenchBody.position.x = 12.18;
    this.tvBenchBody.position.y = -10;
    this.tvBenchBody.quaternion.setFromVectors(
      this.upAxis,
      this.tvBenchBody.position
    );
  }

  // Set up TV physics
  setTVPhysics() {
    // Get TV legs position and quaternion
    let tvLeg001Position;
    let tvLeg001Quaternion;
    let tvLeg002Position;
    let tvLeg002Quaternion;

    this.tvModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "TVLeg001") {
          tvLeg001Position = child.position;
          tvLeg001Quaternion = child.quaternion;
        }
        if (child.name === "TVLeg002") {
          tvLeg002Position = child.position;
          tvLeg002Quaternion = child.quaternion;
        }
      }
    });

    // Create shapes for TV
    const tvShape = new CANNON.Box(new CANNON.Vec3(0.1, 1.2, 2));
    const tvLegShape = new CANNON.Box(new CANNON.Vec3(0.4, 0.06, 0.1));

    this.tvBody = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
    });

    this.tvBody.addShape(tvShape);
    this.tvBody.addShape(
      tvLegShape,
      new CANNON.Vec3().copy(tvLeg001Position),
      new CANNON.Quaternion().copy(tvLeg001Quaternion)
    );
    this.tvBody.addShape(
      tvLegShape,
      new CANNON.Vec3().copy(tvLeg002Position),
      new CANNON.Quaternion().copy(tvLeg002Quaternion)
    );

    this.physicsWorld.addBody(this.tvBody);

    // set position for the TV
    this.tvBody.position.x = 13.65;
    this.tvBody.position.y = -11.5;
    this.tvBody.quaternion.setFromVectors(this.upAxis, this.tvBody.position);
  }

  // Set up switch physics
  setSwitchPhysics() {
    const switchShape = new CANNON.Box(new CANNON.Vec3(0.6, 0.05, 0.25));
    const supportShape = new CANNON.Sphere(0.05);

    this.switchBody = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
    });

    this.switchBody.addShape(switchShape);
    this.switchBody.addShape(supportShape, new CANNON.Vec3(0.5, 0, 0.15));
    this.switchBody.addShape(supportShape, new CANNON.Vec3(0.5, 0, -0.15));
    this.switchBody.addShape(supportShape, new CANNON.Vec3(-0.5, 0, 0.15));
    this.switchBody.addShape(supportShape, new CANNON.Vec3(-0.5, 0, -0.15));

    this.physicsWorld.addBody(this.switchBody);

    // set position for the switch
    this.switchBody.position.x = 12.87;
    this.switchBody.position.y = -10.5;
    this.switchBody.position.z = 3;
    this.switchBody.quaternion.setFromVectors(
      this.upAxis,
      this.switchBody.position
    );
  }

  // Set up diffuser physics
  setDiffuserPhysics() {
    const diffuserShape = new CANNON.Cylinder(0.4, 0.35, 1.5);
    const supportShape = new CANNON.Sphere(0.35);

    this.diffuserBody = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
    });

    this.diffuserBody.addShape(diffuserShape, new CANNON.Vec3(0, 0.75, 0));
    this.diffuserBody.addShape(supportShape, new CANNON.Vec3(0, 0.35, 0));

    this.physicsWorld.addBody(this.diffuserBody);

    // set position for the diffuser
    this.diffuserBody.position.x = 12.55;
    this.diffuserBody.position.y = -10.7;
    this.diffuserBody.position.z = -3.15;
    this.diffuserBody.quaternion.setFromVectors(
      this.upAxis,
      this.tvBenchBody.position
    );
  }

  // Set up shelf physics
  setShelfPhysics() {
    const shelfShape = new CANNON.Box(new CANNON.Vec3(2.7, 1, 0.7));
    const supportShape = new CANNON.Sphere(0.25);

    this.shelfBody = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
    });

    this.shelfBody.addShape(shelfShape);
    this.shelfBody.addShape(supportShape, new CANNON.Vec3(2.5, -1, 0.5));
    this.shelfBody.addShape(supportShape, new CANNON.Vec3(-2.5, -1, 0.5));
    this.shelfBody.addShape(supportShape, new CANNON.Vec3(2.5, -1, -0.5));
    this.shelfBody.addShape(supportShape, new CANNON.Vec3(-2.5, -1, -0.5));

    // Set up shelf trigger body
    const shelfTriggerShape = new CANNON.Cylinder(3.5, 3.5, 2);
    this.shelfTriggerBody = new CANNON.Body({ isTrigger: true });
    this.shelfTriggerBody.addShape(shelfTriggerShape);

    this.physicsWorld.addBody(this.shelfBody);
    this.physicsWorld.addBody(this.shelfTriggerBody);

    // set position for the shelf
    this.shelfBody.position.x = 12;
    this.shelfBody.position.y = -6;
    this.shelfBody.position.z = 10;
    this.shelfBody.quaternion.setFromVectors(
      this.upAxis,
      this.shelfBody.position
    );
  }

  // Set up lego car physics
  setLegoPhysics() {
    const legoShape = new CANNON.Box(new CANNON.Vec3(1.3, 0.35, 0.65));

    this.legoBody = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
    });

    this.legoBody.addShape(legoShape, new CANNON.Vec3(0, 0.3, 0));

    this.physicsWorld.addBody(this.legoBody);

    // set position for the diffuser
    this.legoBody.position.x = 13;
    this.legoBody.position.y = -6.5;
    this.legoBody.position.z = 11;
    this.legoBody.quaternion.setFromVectors(
      this.upAxis,
      this.shelfBody.position
    );
  }

  /**
   * Physics update
   */
  update() {
    /**
     * Table physics update
     */
    this.tableModel.position.copy(this.tableBody.position);
    this.tableModel.quaternion.copy(this.tableBody.quaternion);

    /**
     * Laptop physics update
     */
    this.laptopGroup.position.copy(this.laptopBody.position);
    this.laptopGroup.quaternion.copy(this.laptopBody.quaternion);

    /**
     * Chair physics update
     */
    this.chairModel.position.copy(this.chairBody.position);
    this.chairModel.quaternion.copy(this.chairBody.quaternion);

    /**
     * Speaker physics update
     */
    this.speakerModel.position.copy(this.speakerBody.position);
    this.speakerModel.quaternion.copy(this.speakerBody.quaternion);

    /**
     * Picture frame physics update
     */
    this.picFrameGroup.position.copy(this.picFrameBody.position);
    this.picFrameGroup.quaternion.copy(this.picFrameBody.quaternion);

    /**
     * Mug physics update
     */
    this.mugModel.position.copy(this.mugBody.position);
    this.mugModel.quaternion.copy(this.mugBody.quaternion);

    /**
     * Telescope physics update
     */
    this.telescopeModel.position.copy(this.telescopeBody.position);
    this.telescopeModel.quaternion.copy(this.telescopeBody.quaternion);

    /**
     * Sofa physics update
     */
    // Sofa body physics update
    this.sofaModel.position.copy(this.sofaBody.position);
    this.sofaModel.quaternion.copy(this.sofaBody.quaternion);
    // Sofa pillow 001 physics update
    this.sofaPillowSet[0].position.copy(this.sofaPillow001Body.position);
    this.sofaPillowSet[0].quaternion.copy(this.sofaPillow001Body.quaternion);
    // Sofa pillow 002 physics update
    this.sofaPillowSet[1].position.copy(this.sofaPillow002Body.position);
    this.sofaPillowSet[1].quaternion.copy(this.sofaPillow002Body.quaternion);

    /**
     * TV bench physics update
     */
    this.tvBenchModel.position.copy(this.tvBenchBody.position);
    this.tvBenchModel.quaternion.copy(this.tvBenchBody.quaternion);

    /**
     * TV physics update
     */
    this.tvModel.position.copy(this.tvBody.position);
    this.tvModel.quaternion.copy(this.tvBody.quaternion);

    /**
     * Switch physics update
     */
    this.switchModel.position.copy(this.switchBody.position);
    this.switchModel.quaternion.copy(this.switchBody.quaternion);

    /**
     * Diffuser physics update
     */
    this.diffuserModel.position.copy(this.diffuserBody.position);
    this.diffuserModel.quaternion.copy(this.diffuserBody.quaternion);

    /**
     * Shelf physics update
     */
    this.shelfGroup.position.copy(this.shelfBody.position);
    this.shelfGroup.quaternion.copy(this.shelfBody.quaternion);
    this.shelfTriggerBody.position.copy(this.shelfBody.position);
    this.shelfTriggerBody.quaternion.copy(this.shelfBody.quaternion);

    /**
     * Lego car physics update
     */
    this.legoModel.position.copy(this.legoBody.position);
    this.legoModel.quaternion.copy(this.legoBody.quaternion);
  }
}
