import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();

// 添加一个漫反射材质的效果
{
  const gemometry = new THREE.BoxGeometry(100, 100, 100)
  const material = new THREE.MeshLambertMaterial(({
    // 设置漫反射效果的颜色
    color: new THREE.Color('orange')
  }))

  // 添加一个立方体
  const mesh = new THREE.Mesh(gemometry, material)
  mesh.position.set(0, 0, 0)
  scene.add(mesh)
}
// 添加一个点光源
{
  // 0xffffff是白色，10000是光照强度
  const pointLight = new THREE.PointLight(0xffffff, 10000)
  // 设置光源位置，立方体长宽高为100，有一个角在50,50,50的位置，距离光线比较近，所以内部那个坐标点发光比较明显
  pointLight.position.set(80, 80, 80)
  scene.add(pointLight)
}
{// 添加展示坐标系的工具AxesHelper
  // 坐标轴长度设置为200
  const axesHelper = new THREE.AxesHelper(200)
  scene.add(axesHelper)
}
{
  const width = window.innerWidth
  const height = window.innerHeight

  // 构建相机视角，在200,200,200的位置，视角为60度，宽高比为width/height，近裁剪面为1，远裁剪面为1000
  /**
   * 第一个参数:角度(fov)，决定了你看的范围有多大
   * 第二个参数:宽高比(aspect)，决定了你在浏览器页面画幅看到的画面有多大
   * 第三个参数:近裁剪面(near)，决定了你看到的画面有多近
   */
  const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000)
  camera.position.set(200, 200, 200)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)

  function render() {
    renderer.render(scene, camera)
    // 使用 requestAnimationFrame 来更新控制器，并重新渲染场景。
    // 调用该方法来实现对scene的一帧帧地循环渲染
    requestAnimationFrame(render)
  }
  render()
  document.body.appendChild(renderer.domElement)

  // 创建 OrbitControls 的实例，传入 camera 和 canvas 元素。
  const controls = new OrbitControls(camera, renderer.domElement)

}