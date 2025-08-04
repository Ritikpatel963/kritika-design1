import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';

gsap.registerPlugin(ScrollTrigger);

const locomotiveScroll = new LocomotiveScroll();

// You can now use ScrollTrigger with animations




// Import postprocessing modules
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';


// Scene setup
const scene = new THREE.Scene();
// Camera
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 3.5;

// renderer
const renderer = new THREE.WebGLRenderer
({ canvas: document.getElementById('canvas'), antialias: true , alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

let model;

// HDRI loader
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/pond_bridge_night_1k.hdr', function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    // scene.background = texture;
    texture.dispose();
    pmremGenerator.dispose();
});

// GLTF Loader
const loader = new GLTFLoader();
loader.load('./DamagedHelmet.gltf', (gltf) => {
    model = gltf.scene;
    scene.add(model);
}, undefined, (error) => {
    console.error('An error occurred:', error);
});

window.addEventListener('mousemove', (event) => { 
   if (model) {
        const rotationX = (event.clientX / window.innerWidth - 0.5) * (Math.PI * .12);
        const rotationY = (event.clientY / window.innerHeight - 0.5) * (Math.PI * .12);

        gsap.to(model.rotation, {
            x: rotationY,
            y: rotationX,
            duration: 0.5,
            ease: "power2.out"
        });
        model.rotation.x = rotationY;
        model.rotation.y = rotationX;
    }
});

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

// Postprocessing setup
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.0030; // Adjust for desired effect
composer.addPass(rgbShiftPass);

// render
function animate() {
    requestAnimationFrame(animate);
    
    composer.render();
}
animate();

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});
 
  
        
        
       
