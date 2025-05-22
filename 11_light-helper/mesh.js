// 平行光

import * as THREE from 'three';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js'

const gui=new GUI() // 创建 GUI 实例

const planeGeometry=new THREE.PlaneGeometry(1000,1000);
const planeMaterial=new THREE.MeshLambertMaterial({
  color:new THREE.Color('skyblue') // 平面颜色：天蓝色
})

const plane=new THREE.Mesh(planeGeometry,planeMaterial)
plane.rotateX(-Math.PI/2)
plane.position.y=-50

const boxGeometry=new THREE.BoxGeometry(100,100,100)
const boxMaterial=new THREE.MeshLambertMaterial({
  color:new THREE.Color('orange') // 立方体颜色：橙色
})

const box=new THREE.Mesh(boxGeometry,boxMaterial)

const box2=box.clone()
box2.position.x=200

export const mesh=new THREE.Group()
mesh.add(plane,box,box2)

// 添加平行光
export const light=new THREE.DirectionalLight(0xffffff,1) // 创建平行光，颜色为白色，强度为 1
light.position.set(400,500,300) // 设置光源位置，同时也定义了光线的方向（从该位置指向原点或 target）
light.lookAt(0,0,0) // 设置光源照射的目标点（原点）

// 添加gui来调试平行光的不同调参的效果
const f1=gui.addFolder('平行光') // 创建一个名为"平行光"的 GUI 文件夹
f1.add(light.position,'x').min(10).max(1000) // 添加 x 轴位置控制器
f1.add(light.position,'y').min(10).max(1000) // 添加 y 轴位置控制器
f1.add(light.position,'z').min(10).max(1000) // 添加 z 轴位置控制器
f1.add(light,'intensity').min(0).max(10) // 添加光照强度控制器


const helper=new THREE.DirectionalLightHelper(light,100) // 创建平行光辅助对象，参数100为辅助平面的尺寸
mesh.add(helper) // 将辅助对象添加到场景中