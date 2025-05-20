import * as THREE from 'three';
// 从 Three.js 的附加库中引入轻量级 GUI 控制面板
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';




// —— 1. 创建一个 BoxGeometry（长方体几何体）
// 参数依次是：宽度（X 轴尺寸）4200，
//             高度（Y 轴尺寸）2000，
//             深度（Z 轴尺寸）100

const loader=new THREE.TextureLoader();
const texture=loader.load('./assets/wa.png')
texture.colorSpace=THREE.SRGBColorSpace;
texture.wrapS=THREE.RepeatWrapping;
texture.repeat.x=4;


const geometry = new THREE.BoxGeometry(4200, 2000, 100);

// —— 2. 创建一个支持光照的 Lambert 漫反射材质，颜色设为红色
const material = new THREE.MeshLambertMaterial({
  // color: new THREE.Color('red')
  map:texture,
  aoMap:texture
});

// —— 3. 用几何体和材质创建一个可渲染的网格对象 roof
const roof = new THREE.Mesh(geometry, material);
roof.position.y=2600;
roof.position.z=-800;
// 注意：这里需要将旋转角度转换为弧度
roof.rotation.x=55/180*Math.PI
// —— 4. 定义一个普通对象 obj，用来存放通过 GUI 面板控制的参数
//    rotateX：绕 X 轴的旋转角度（弧度）
//    width：长方体的“高度”参数（将用于重新生成几何体）
const obj = {
  rotateX: 0,
  width: 2000
};

// —— 5. 创建 GUI 面板实例，默认会插入到页面右上角
const gui = new GUI();

// —— 6. 添加对 roof.position.y 的控制
//    滑条范围：-10000 到 10000，步长 100
//    用于在场景中上下移动模型
gui.add(roof.position, 'y')
   .min(-10000).max(10000).step(100);

// —— 7. 添加对 roof.position.z 的控制
//    滑条范围同上，用于前后平移模型
gui.add(roof.position, 'z')
   .min(-10000).max(10000).step(100);

// —— 8. 添加对材质 color 的颜色选择器
//    实时改变 roof 的颜色
gui.addColor(roof.material, 'color');

// —— 9. 添加对 obj.rotateX 的控制
//    滑条范围：0 到 2π（全旋转），步长 0.01 弧度
//    onChange 回调里，将新的角度赋给 roof.rotation.x
gui.add(obj, 'rotateX')
   .min(0).max(Math.PI * 2).step(0.01)
   .onChange(value => {
     // value 已经是弧度，无需再转换
     roof.rotation.x = value;
   });

// —— 10. 添加对 obj.width 的控制
//    用于动态调整几何体的“高度”
//    滑条范围：0 到 5000，步长 10
//    onChange 回调里，重新生成一个新的 BoxGeometry
gui.add(obj, 'width')
   .min(0).max(5000).step(10)
   .onChange(value => {
     // 注意：保持 X 和 Z 尺寸不变，更新 Y 尺寸为 value
     roof.geometry = new THREE.BoxGeometry(4200, value, 100);
   });
export {gui}
// —— 11. 导出生成的 roof 对象，供其他模块添加到场景中
export default roof;
