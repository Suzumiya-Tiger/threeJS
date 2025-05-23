import * as THREE from 'three';

// 1. 定义四个控制点，用来描述三次贝塞尔曲线的走势
const p1 = new THREE.Vector3(-100, 0, 0)   // 起点
const p2 = new THREE.Vector3(50, 100, 0)   // 第一控制点
const p3 = new THREE.Vector3(100, 0, 100)  // 第二控制点
const p4 = new THREE.Vector3(100, 0, 0)    // 终点

// 2. 用这四个点创建一条三次贝塞尔曲线
const curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4)

// 3. 基于曲线生成一个“管道”几何体
//    - curve：曲线路径
//    - 50    ：沿曲线方向分段数（细分程度）
//    - 10    ：管道截面的半径
//    - 20    ：管道截面圆周上分段数（圆环细分）
const geometry = new THREE.TubeGeometry(curve, 50, 10, 20)

// 4. 使用基础材质（不受光照影响）渲染管道网格
const material = new THREE.MeshPhongMaterial({
  color: new THREE.Color('white'),
  // MeshPhongMaterial是Phong光照模型，可以模拟真实的光照效果,并且支持调节光泽度
    // 光泽度，值越大，光泽度越高，表面越光滑
  // 0-1000，默认30
  shininess: 500,

})

// 5. 创建网格并导出
const mesh = new THREE.Mesh(geometry, material)
console.log('mesh',mesh);

export default mesh