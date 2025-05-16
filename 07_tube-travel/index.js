import * as THREE from 'three'; // 引入 three.js 主库
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js'; // 引入轨道控制器，用于鼠标控制视角
import mesh,{tubePoints} from './mesh.js'; // 引入自定义的网格模型

const scene = new THREE.Scene(); // 创建一个场景

scene.add(mesh); // 将网格模型添加到场景中

const pointLight = new THREE.PointLight(0xffffff, 200); // 创建一个点光源，颜色为白色，强度为 200
pointLight.position.set(80, 80, 80); // 设置点光源的位置
scene.add(pointLight); // 将点光源添加到场景中

const width = window.innerWidth; // 获取浏览器窗口的宽度
const height = window.innerHeight; // 获取浏览器窗口的高度

const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000); // 创建一个透视相机
// 参数：
// 60: 视场角 (FOV), 表示相机可以看到的范围
// width / height: 宽高比，通常设置为窗口的宽高比
// 1: 近裁剪面，相机能看到的最近距离
// 10000: 远裁剪面，相机能看到的最远距离
camera.position.set(200, 200, 200); // 设置相机的位置
camera.lookAt(0, 0, 0); // 设置相机的观察点，即相机看向场景中的原点

const renderer = new THREE.WebGLRenderer(); // 创建一个 WebGL 渲染器
renderer.setSize(width, height); // 设置渲染器的尺寸为窗口的宽高

let i=0;

function render() { // 定义每一帧的渲染逻辑
  // console.log('tubePoints', tubePoints); // 用于调试，可以打印出路径点信息

  // 检查索引 i 是否还在 tubePoints 数组的有效范围内
  // 需要确保 i+1 也是有效的，因为 camera.lookAt 会使用下一个点
  if (i < tubePoints.length - 1) {
    // 将相机的位置 (camera.position) 更新为当前路径点 (tubePoints[i])
    // .copy() 方法用于复制向量值，避免直接引用导致意外修改
    camera.position.copy(tubePoints[i]);

    // 让相机朝向 (lookAt) 路径上的下一个点 (tubePoints[i+1])
    // 这会调整相机的旋转，使其镜头对准目标点
    camera.lookAt(tubePoints[i+1]);

    // 索引递增，以便下一帧处理路径上的下一个点
    i += 1;
  } else {
    // 如果已经到达路径的末尾（或接近末尾，使得 i+1 无效）
    // 则将索引 i 重置为 0，使动画从路径起点重新开始
    i = 0;
  }

  renderer.render(scene, camera); // 使用相机渲染场景
  requestAnimationFrame(render); // 请求下一帧动画，实现持续渲染
}

render(); // 调用渲染函数，开始渲染

document.body.append(renderer.domElement); // 将渲染器的 DOM 元素 (canvas) 添加到 HTML 的 body 中

const controls = new OrbitControls(camera, renderer.domElement); // 创建轨道控制器实例
// 参数：
// camera: 需要控制的相机
// renderer.domElement: 用于监听鼠标事件的 DOM 元素

// 我们甚至可以将其改成键盘控制
document.addEventListener('keydown',(e)=>{
  if(e.key==='ArrowRight'){
    i+=1;
  }else if(e.key==='ArrowLeft'){
    i-=1;
  }
})