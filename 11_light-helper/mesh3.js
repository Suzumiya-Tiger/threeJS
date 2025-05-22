import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const gui=new GUI() // 创建 GUI 实例

const planeGeometry=new THREE.PlaneGeometry(1000,1000)
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

// 添加聚光灯
// 参数1：光源颜色 (0xffffff 代表白色)
// 参数2：光照强度。注意: Three.js r155 版本后，SpotLight 的强度单位为物理单位坎德拉(cd)。
// 此处 1000000 是一个较大的值，如果场景过曝，可以尝试减小或查阅文档使用 power (流明)。
export const light=new THREE.SpotLight(0xffffff,1000000)
light.distance=1000 // 光源照射的最大距离，0 表示无限远
light.angle=Math.PI/6 // 聚光灯的张角，以弧度为单位 (Math.PI/6 等于 30度)
light.position.set(400,500,300) // 设置聚光灯的位置
light.lookAt(0,0,0) // 设置聚光灯照射的目标点（原点）
// light.penumbra = 0.5; // 可以设置半影的衰减百分比，使边缘柔和
// light.decay = 2; // 光照强度随距离的衰减率，物理上通常为2

const helper=new THREE.SpotLightHelper(light) // 创建聚光灯辅助对象
mesh.add(helper) // 将辅助对象添加到场景中


const f1=gui.addFolder('聚光灯') // 创建一个名为"聚光灯"的 GUI 文件夹

// 定义一个 onChange 回调函数，当 GUI 控制器改变光源参数时，调用此函数
function onChange(){
  helper.update() // 更新聚光灯辅助对象的显示，使其与光源状态同步
}

f1.add(light.position,'x').min(10).max(1000).onChange(onChange) // 添加 x 轴位置控制器
f1.add(light.position,'y').min(10).max(1000).onChange(onChange) // 添加 y 轴位置控制器
f1.add(light.position,'z').min(10).max(1000).onChange(onChange) // 添加 z 轴位置控制器
f1.add(light,'angle',{ // 添加张角控制器，提供预设值
  '30度':Math.PI/6,
  '45度':Math.PI/4,
  '60度':Math.PI/3,
  '90度':Math.PI/2,
  '120度':Math.PI*2/3,
  '150度':Math.PI*5/6,
  '180度':Math.PI,
}).onChange(onChange)
// intensity 光照强度
f1.add(light,'intensity').min(0).max(2000000).onChange(onChange) // 添加光照强度控制器 (根据实际单位调整范围)

f1.add(light,'distance').min(0).max(2000).onChange(onChange) // 添加光照距离控制器，0表示无限远
// f1.add(light, 'penumbra').min(0).max(1).step(0.01).onChange(onChange); // 可以添加半影控制器
// f1.add(light, 'decay').min(0).max(5).step(0.01).onChange(onChange);    // 可以添加衰减率控制器