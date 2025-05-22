import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// 平行光
// import { mesh, light } from './mesh.js';
// 点光源
// import { mesh, light } from './mesh2.js';
// 聚光灯
// import { mesh, light } from './mesh3.js';
// 半球光
// import { mesh, light } from './mesh4.js';
// 矩形平面光
import { mesh, light } from './mesh5.js';
const scene = new THREE.Scene();


scene.add(mesh, light);

const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
camera.position.set(200, 800, 800);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
