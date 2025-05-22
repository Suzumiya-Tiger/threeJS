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

// 坐标格辅助对象
const gridHelper = new THREE.GridHelper(1000, 10, new THREE.Color('green'), new THREE.Color('pink'));
scene.add(gridHelper);

// 标识方向(起点)
const origin=new THREE.Vector3(0,0,0)
// 目标方向
const dir=new THREE.Vector3(1,2,0)
// 用 nomalize 方法把dir变为长度为 1 的单位向量
dir.normalize()
const arrowHelper=new THREE.ArrowHelper(dir,origin,500,new THREE.Color('yellow'))
scene.add(arrowHelper)


// 极坐标格辅助对象
const helper = new THREE.PolarGridHelper( 500, 10, 5, 64 );
scene.add( helper );
// scene.add(mesh, light);

/* const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper); */

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
camera.position.set(200, 800, 800);
camera.lookAt(0, 0, 0);

// CameraHelper
const camera2=new THREE.PerspectiveCamera(20,16/9,100,300)
const cameraHelper = new THREE.CameraHelper(camera2);
scene.add(cameraHelper);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
