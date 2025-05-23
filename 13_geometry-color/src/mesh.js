import * as THREE from 'three';

// 1️⃣ 创建一个空的 BufferGeometry，用于存储顶点数据
const geometry = new THREE.BufferGeometry();

// 2️⃣ 定义三个 Vector3 点，用来描述 Points 模型的顶点位置
const point1 = new THREE.Vector3(0,   0,   0)   // 顶点 A：原点
const point2 = new THREE.Vector3(0,   100, 0)   // 顶点 B：Y 轴正方向 100
const point3 = new THREE.Vector3(100, 0,   0)   // 顶点 C：X 轴正方向 100

// 3️⃣ 将这些 Vector3 点转换成 BufferGeometry 的 position 属性
geometry.setFromPoints([ point1, point2, point3 ])

// 4️⃣ 定义每个顶点对应的颜色（RGB 向量）
//    三个顶点分别是红、绿、蓝
const colors = new Float32Array([
  1, 0, 0,  // 顶点 A：红色
  0, 1, 0,  // 顶点 B：绿色
  0, 0, 1   // 顶点 C：蓝色
])
// 5️⃣ 将颜色数据包装成 BufferAttribute 并赋值给 geometry
geometry.attributes.color = new THREE.BufferAttribute(colors, 3)

// 6️⃣ 创建 PointsMaterial，启用顶点颜色，并设置点大小
/* const material = new THREE.PointsMaterial({
  vertexColors: true,  // 使用每个顶点的 color 属性
  size: 30             // 点的像素尺寸
})
 */

// 这里顶点顺序是顺时针构成的三角形，是反面，默认不渲染正面，需要反过来看
const material=new THREE.MeshBasicMaterial({
  vertexColors:true,
})
// 7️⃣ 用 Points（点云）对象把几何体和材质组合起来
// const mesh = new THREE.Points(geometry, material)

const mesh=new THREE.Mesh(geometry,material)

// 8️⃣ 导出 mesh，以便在场景中添加和渲染
export default mesh
