// 点光源

import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const gui = new GUI(); // 创建 GUI 实例

// 创建平面几何体和材质
const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
const planeMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color('skyblue') // 平面颜色：天蓝色
});

const plane=new THREE.Mesh(planeGeometry,planeMaterial) // 创建平面网格模型
plane.rotateX(-Math.PI/2) // 绕 X 轴旋转-90度，使其水平
plane.position.y=-50 // 设置平面 y 轴位置

// 创建立方体几何体和材质
const boxGeometry=new THREE.BoxGeometry(100,100,100)
const boxMaterial=new THREE.MeshLambertMaterial({
  color:new THREE.Color('orange') // 立方体颜色：橙色
})

const box=new THREE.Mesh(boxGeometry,boxMaterial) // 创建立方体网格模型

const box2=box.clone() // 克隆第一个立方体
box2.position.x=200 // 设置第二个立方体 x 轴位置

export const mesh=new THREE.Group() // 创建一个组，用于包含所有网格模型和光源
mesh.add(plane,box,box2) // 将平面和两个立方体添加到组中

// 添加点光源
// 参数1：光源颜色 (0xffffff 代表白色)
// 参数2：光照强度。注意: Three.js r155 版本后，PointLight 的强度单位为物理单位坎德拉(cd)。
// 此处 1000000 是一个较大的值，如果场景过曝，可以尝试减小或查阅文档使用 power (流明)。
export const light=new THREE.PointLight(0xffffff,1000000)
light.position.set(400,500,300) // 设置点光源的位置
// light.lookAt(0,0,0) // 点光源向所有方向发光，通常不需要 lookAt

// 环境光可以保证物体的背光面也可以被看到，而不是完全黑色
const ambientLight=new THREE.AmbientLight(0xffffff, 0.5) // 创建环境光，白色，强度0.5
mesh.add(ambientLight) // 将环境光添加到场景中 (修正：原代码未添加环境光到mesh，这里添加了)

const helper=new THREE.PointLightHelper(light,100) // 创建点光源辅助对象，参数100为辅助球体的尺寸
mesh.add(helper) // 将辅助对象添加到场景中

const f1=gui.addFolder('点光源') // 创建一个名为"点光源"的 GUI 文件夹
f1.add(light.position,'x').min(10).max(1000) // 添加 x 轴位置控制器
f1.add(light.position,'y').min(10).max(1000) // 添加 y 轴位置控制器
f1.add(light.position,'z').min(10).max(1000) // 添加 z 轴位置控制器
f1.add(light,'intensity').min(0).max(2000000) // 添加光照强度控制器 (根据实际单位调整范围)
// f1.add(light, 'distance').min(0).max(2000) // 可以添加 distance 控制器
// f1.add(light, 'decay').min(0).max(5)       // 可以添加 decay 控制器



