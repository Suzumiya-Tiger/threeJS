import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh.js';

const scene = new THREE.Scene();

scene.add(mesh);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
camera.position.set(300, 300, 300);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)
let H=0
const clock=new THREE.Clock();
function render() {
  const delta=clock.getDelta()
  /**
   * 这里的动画我们采用不让相机视角动，而是使用uv动画来实现材质纹理的移动，模拟相机视角的移动
   * mesh.material.alphaMap.offset.y+=0.01
   */
  H+=0.002
  if(H>1){
    H=0
  }
  mesh.material.color.setHSL(H,0.5,0.5)
  mesh.material.alphaMap.offset.y+=delta*0.5
  mesh.rotation.y+=delta*0.5
    renderer.render(scene, camera);
    /* requestAnimationFrame 是浏览器提供的用于驱动动画循环的 API；
    它会在下次浏览器重绘（repaint）之前 调用你传入的回调函数，从而使动画与屏幕的刷新率（通常为 60Hz）保持同步，
    并在后台标签页时自动暂停，提升性能和节能效果
 */
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change',()=>{
  console.log(camera.position);
})
camera.position.set(-0.26, 519, 0);
// 强制更新控制器，实现上面camera.position.set(-0.26, 519, 0)的移动
controls.update();
