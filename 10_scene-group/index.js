import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh.js';

const scene = new THREE.Scene();
/* mesh.position.x = 200;
mesh.translateZ(200);
mesh.translateY(50) */

const group = new THREE.Group();
group.add(mesh); // mesh 成为 group 的子对象
scene.add(group); // group 成为 scene 的子对象

// 设置 group 的世界坐标 (相对于 scene)
group.position.x = 200;
group.translateZ(200); // 这会改变 group.position.z
group.translateY(50);  // 这会改变 group.position.y
// 此时，group 的世界坐标大致为 (200, 50, 200)

// 设置 mesh 的局部坐标 (相对于 group)
mesh.position.x = 200;


// 使用getWorldPosition 获取 mesh 的世界坐标

// 通过创建一个vector3对象，再通过mesh的getWorldPosition方法，把这个创建的vector3对象作为参数传入，获取mesh的世界坐标
const pos=new THREE.Vector3();
mesh.getWorldPosition(pos);
console.log(pos);
console.log(mesh.position);
console.log(group.position);

// 假设 mesh.position.y 和 mesh.position.z 默认为 0 (相对于 group)
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(3000, 2000, 1000);
scene.add(light);

const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

// 通过坐标轴来显示group的局部坐标系
const axesHelper2 = new THREE.AxesHelper(1000);
group.add(axesHelper2);

// 遍历Scene中的所有对象
scene.traverse((obj)=>{
  console.log(obj);
  // 通过isMesh来判断是否是网格对象，如果是网格对象，则修改它的颜色
  if(obj.isMesh){
    obj.material.color.set(0x00ff00);
  }
})
// 通过名称来获取指定的对象，并且修改它的颜色
const cube = scene.getObjectByName('cube');
cube.material.color = new THREE.Color('lightgreen');


const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
camera.position.set(500, 500, 500);
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

