import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const gui=new GUI() // 创建 GUI 实例

// 创建平面几何体和材质
const planeGeometry=new THREE.PlaneGeometry(1000,1000)
const planeMaterial=new THREE.MeshLambertMaterial({
  color:new THREE.Color('white') // 平面颜色：白色
})

const plane=new THREE.Mesh(planeGeometry,planeMaterial) // 创建平面网格模型
plane.rotateX(-Math.PI/2) // 绕 X 轴旋转-90度，使其水平
plane.position.y=-50 // 设置平面 y 轴位置

// 创建立方体几何体和材质
const boxGeometry=new THREE.BoxGeometry(100,100,100)
const boxMaterial=new THREE.MeshLambertMaterial({
  color:new THREE.Color('white') // 立方体颜色：白色
})

const box=new THREE.Mesh(boxGeometry,boxMaterial) // 创建立方体网格模型
const box2=box.clone() // 克隆第一个立方体
box2.position.x=200 // 设置第二个立方体 x 轴位置

export const mesh=new THREE.Group() // 创建一个组，用于包含所有网格模型和光源
mesh.add(plane,box,box2) // 将平面和两个立方体添加到组中

// 添加半球光
// 参数1: skyColor - 天空光的颜色 (来自上方的光)
// 参数2: groundColor - 地面光的颜色 (来自下方的光)
// 参数3 (可选): intensity - 光照强度，默认为 1
export const light=new THREE.HemisphereLight(
  new THREE.Color('orange'), // 天空光颜色：橙色
  new THREE.Color('green'),  // 地面光颜色：绿色
  1                          // 光照强度为1 (这里显式添加了默认值以便理解)
)
// 设置光源位置。对于半球光，其位置定义了光照的方向。
// 光从光源位置指向目标（默认为原点）的方向被视为天空方向。
light.position.set(400,500,300)
// light.lookAt(0,0,0) // HemisphereLight 默认目标是 (0,0,0)，这行可以省略，但明确指出有助于理解其朝向

const helper=new THREE.HemisphereLightHelper(light,100) // 创建半球光辅助对象，参数100为辅助几何体的大小
mesh.add(helper) // 将辅助对象添加到场景中

const f1=gui.addFolder('半球光') // 创建一个名为“半球光”的 GUI 文件夹
f1.add(light.position,'x').min(10).max(1000) // 添加 x 轴位置控制器
f1.add(light.position,'y').min(10).max(1000) // 添加 y 轴位置控制器
f1.add(light.position,'z').min(10).max(1000) // 添加 z 轴位置控制器
f1.add(light,'intensity',0,5) // 添加光照强度控制器，范围0到5 (原代码为1到5，调整为0起始更合理)
f1.addColor(light,'color').name('天空光颜色')      // 添加天空光颜色控制器
f1.addColor(light,'groundColor').name('地面光颜色') // 添加地面光颜色控制器
