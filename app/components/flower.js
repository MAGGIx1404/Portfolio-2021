import { vert, frag, bg_frag, bg_vert, p_frag, p_vert } from "./shaders";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

const fragment_s = frag;
const vertex_s = vert;
const fragmentParticle = p_frag;
const vertexParticle = p_vert;

const backgroundVertex = bg_vert;
const backgroundFragment = bg_frag;

export default class THREEScene {
  constructor(
    container = document.body
  ) {
    this.container = container;

    this.init();
  }

  init() {
    this.setup();
    this.camera();
    this.addToScene();
    this.createParticles();
    // this.createBackground();
    this.eventListeners();
    this.render();
    this.animate();
  }

  setup() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio = window.devicePixelRatio;
    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.classList.add("flower-container");
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex_s,
      fragmentShader: fragment_s,
      wireframe: false,
      uniforms: {
        u_time: { value: 0 },
        u_progress: { value: 0 }
      }
    });

    this.pointsMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexParticle,
      fragmentShader: fragmentParticle,
      wireframe: false,
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        u_time: { value: 0 },
        u_progress: { value: 0 }
      }
    });
    this.clock = new THREE.Clock();
  }

  camera() {
    const fov = 40;
    const near = 0.1;
    const far = 1000;
    const aspectRatio = this.viewport.aspectRatio;
    this.camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
    //this.camera = new THREE.OrthographicCamera(
    //  this.viewport.width / -2,
    //this.viewport.width / 2,
    //this.viewport.height / 2,
    //this.viewport.height / -2,
    //1,
    //1000
    //);
    this.camera.position.set(0, 0, 5);
    //this.controls = new THREE.OrbitControls(
    //  this.camera,
    //this.renderer.domElement
    //);
  }

  addToScene() {
    this.geometry = new THREE.SphereGeometry(1, 162, 162);
    const sphere = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(sphere);
  }

  createParticles() {
    const N = 2000;
    const position = new Float32Array(N * 3);
    this.particleGeometry = new THREE.BufferGeometry();

    let inc = Math.PI * (3 - Math.sqrt(5));
    let offset = 2 / N;
    let radius = 2;

    for (let i = 0; i < N; i++) {
      let y = i * offset - 1 + offset / 2;
      let r = Math.sqrt(1 - y * y);
      let phi = i * inc;

      position[3 * i] = radius * Math.cos(phi) * r;
      position[3 * i + 1] = radius * y;
      position[3 * i + 2] = radius * Math.sin(phi) * r;
    }

    this.particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(position, 3)
    );

    this.points = new THREE.Points(this.particleGeometry, this.pointsMaterial);
    this.scene.add(this.points);
  }

  createBackground() {
    const geometry = new THREE.PlaneGeometry(100, 15, 16);
    this.backgroundMaterial = new THREE.ShaderMaterial({
      vertexShader: backgroundVertex,
      fragmentShader: backgroundFragment,
      wireframe: false,
      uniforms: {
        u_time: { value: 0 },
        u_progress: { value: 0 }
      }
    });

    const mesh = new THREE.Mesh(geometry, this.backgroundMaterial);
    mesh.position.z = -2;
    this.scene.add(mesh);
  }

  render() {
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
    this.material.uniforms.u_time.value = this.clock.getElapsedTime();
    this.pointsMaterial.uniforms.u_time.value = this.clock.getElapsedTime();
    // this.backgroundMaterial.uniforms.u_time.value = this.clock.getElapsedTime();
    this.points.rotation.y += 0.005;

    requestAnimationFrame(() => {
      this.render();
    });
  }

  animate() {
    gsap
      .timeline({
        repeat: -1,
        yoyo: true
      })
      .to(this.material.uniforms.u_progress, {
        value: 5,
        duration: 15,
        ease: "power3.inOut"
      })
      .to(this.material.uniforms.u_progress, {
        value: 5,
        duration: 15,
        ease: "power3.inOut"
      });
    gsap.to(this.pointsMaterial.uniforms.u_progress, {
      value: 0.4,
      duration: 5,
      ease: "power3.inOut"
    });
  }

  eventListeners() {
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  onWindowResize() {
    this.material.uniforms.u_time.value = this.clock.getElapsedTime();
    this.camera.aspect = this.viewport.aspectRatio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.viewport.width, this.viewport.height);
  }

  get viewport() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const aspectRatio = width / height;

    return {
      width,
      height,
      aspectRatio
    };
  }
}
