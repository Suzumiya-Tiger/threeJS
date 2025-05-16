// ... existing code ...
import * as THREE from 'three'; // 引入Three.js库

import {
  OrbitControls
} from 'three/addons/controls/OrbitControls.js'; // 引入轨道控制器
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'; // 引入GUI库
const scene = new THREE.Scene() // 创建场景对象

const geometry = new THREE.BoxGeometry(100, 100, 100) // 创建一个长方体几何体，长宽高都为100
const material = new THREE.MeshLambertMaterial(({ // 创建一个兰伯特材质
  color: new THREE.Color("blue") // 设置材质颜色为蓝色
}))

const mesh = new THREE.Mesh(geometry, material) // 创建一个网格模型，将几何体和材质组合起来

mesh.position.set(0, 0, 0) // 设置网格模型的位置为坐标原点

scene.add(mesh) // 将网格模型添加到场景中

const gui = new GUI() // 创建GUI实例
const meshFolder = gui.addFolder('立方体') // 创建一个名为"立方体"的GUI文件夹
// 调整mesh物体
meshFolder.addColor(mesh.material, 'color') // 添加颜色控制器，用于调整立方体颜色
meshFolder.add(mesh.position, 'x').step(10) // 添加x轴位置控制器，步长为10
meshFolder.add(mesh.position, 'y').step(10) // 添加y轴位置控制器，步长为10
meshFolder.add(mesh.position, 'z').step(10) // 添加z轴位置控制器，步长为10



const pointLight = new THREE.PointLight(0xffffff, 10000) // 创建一个点光源，颜色为白色，强度为10000

pointLight.position.set(80, 80, 80) // 设置点光源的位置

scene.add(pointLight) // 将点光源添加到场景中

// 调整灯源
const lightFolder = gui.addFolder('灯源') // 创建一个名为"灯源"的GUI文件夹
lightFolder.add(pointLight.position, 'x').step(10) // 添加x轴位置控制器，步长为10
lightFolder.add(pointLight.position, 'y').step(10) // 添加y轴位置控制器，步长为10
lightFolder.add(pointLight.position, 'z').step(10) // 添加z轴位置控制器，步长为10
// 调整灯源强度
lightFolder.add(pointLight, 'intensity').step(1000) // 添加强度控制器，步长为1000


const otherFolder = gui.addFolder('其他类型') // 创建一个名为"其他类型"的GUI文件夹
const obj = { // 定义一个包含不同类型数据的对象
  aaa: '天王盖地虎', // 字符串类型
  bbb: false, // 布尔类型
  ccc: 0, // 数字类型
  ddd: '111', // 字符串类型，将作为下拉列表的默认值
  fff: 'Bbb', // 字符串类型，将作为对象属性选择的默认值
  logic: function () { // 函数类型
    alert('执行一段逻辑!');
  }
};

otherFolder.add(obj, 'aaa').onChange((value) => console.log(value)) // 添加字符串控制器，并在值改变时打印新值到控制台
otherFolder.add(obj, 'bbb') // 添加布尔值控制器 (复选框)
otherFolder.add(obj, 'ccc').min(-10).max(10).step(0.5) // 添加数字控制器，并设置最小值、最大值和步长
otherFolder.add(obj, 'ddd', ['111', '222', '333']) // 添加下拉列表控制器
otherFolder.add(obj, 'fff', { Aaa: 0, Bbb: 0.1, Ccc: 5 }) // 添加对象属性选择控制器
otherFolder.add(obj, 'logic') // 添加按钮，点击时执行obj.logic函数

const axesHelper = new THREE.AxesHelper(200) // 创建一个坐标轴辅助器，长度为200
scene.add(axesHelper) // 将坐标轴辅助器添加到场景中

const width = window.innerWidth // 获取浏览器窗口的宽度
const height = window.innerHeight // 获取浏览器窗口的高度

const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000) // 创建一个透视相机
// 参数：视野角度，宽高比，近裁剪面，远裁剪面

camera.position.set(200, 200, 200) // 设置相机的位置

camera.lookAt(0, 0, 0) // 设置相机的观察点为坐标原点

const renderer = new THREE.WebGLRenderer() // 创建一个WebGL渲染器
renderer.setSize(width, height) // 设置渲染器的尺寸为浏览器窗口的宽高

function render() { // 定义渲染函数
  renderer.render(scene, camera) // 执行渲染操作，将场景和相机渲染到屏幕上
  requestAnimationFrame(render) // 请求下一帧动画，实现持续渲染
}

render() // 调用渲染函数开始渲染

document.body.append(renderer.domElement) // 将渲染器的DOM元素添加到HTML的body中，用于显示渲染结果

const controls = new OrbitControls(camera, renderer.domElement) // 创建轨道控制器实例，允许用户通过鼠标交互控制相机
// 参数：相机对象，渲染器的DOM元素