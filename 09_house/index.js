import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import house from './house.js'
import grass from './grass.js'
import {gui} from './roof.js'
const scene=new THREE.Scene();
scene.fog=new THREE.Fog(0xcccccc,1000,40000)
const fogControl=gui.addFolder('雾')
fogControl.add(scene.fog,'near').step(100)
fogControl.add(scene.fog,'far').step(1000)

scene.add(house)
scene.add(grass)

// 添加光源，DirectionalLight 平行光
const directionLight=new THREE.DirectionalLight(0xffffff);
// 设置光源位置
directionLight.position.set(3000,3000,3000)

scene.add(directionLight)

// 创建环境光
const anbientLight=new THREE.AmbientLight()

scene.add(anbientLight)

// 创建辅助坐标轴
/* const axeHelper=new THREE.AxesHelper(20000)
scene.add(axeHelper) */

const width=window.innerWidth;
const height=window.innerHeight;

// 创建透视相机，60度视角，宽高比，近面，远面
const camera=new THREE.PerspectiveCamera(60,width/height,1,30000)

camera.position.set(5000,5000,5000)

camera.lookAt(0,0,0)

const renderer=new THREE.WebGLRenderer({
  // 开启深度缓冲区，用来解决深度冲突
  logarithmicDepthBuffer:true
})
renderer.setClearColor(new THREE.Color('skyblue'))
renderer.setSize(width,height)


// 相机旋转视角
let angle = 0;     // 记录当前角度，用来算出相机的位置
let radius = 5000; // 圆圈的半径，也就是相机离场景中心的距离

function render() {
  // 1. 每次渲染前，让角度往前走一点
  angle += 0.01;   // 以 0.01 弧度增量为例，大约每帧转 1.7°（0.03 × 180/π ≈ 1.72°）
if(angle>Math.PI*2){
angle-=Math.PI*2
radius=5000+Math.random()*10000

camera.position.y=Math.random()*10000
}
  // 2. 计算新的相机位置：在水平面（XZ 平面）上绕原点做圆周运动
  //   x = 半径 × cos(当前角度)
  camera.position.x = radius * Math.cos(angle);
  //   z = 半径 × sin(当前角度)
  camera.position.z = radius * Math.sin(angle);
  //   y 保持不变（如果想上下也动，可以同样用 sin/cos）

  // 3. 每次都让相机“看”向场景中心 (0,0,0)
  camera.lookAt(0, 0, 0);

  // 4. 渲染这一帧
  renderer.render(scene, camera);

  // 5. 请求下一帧，循环调用自己，实现动画
  requestAnimationFrame(render);
}

render()

document.body.append(renderer.domElement)

const controls=new OrbitControls(camera,renderer.domElement)