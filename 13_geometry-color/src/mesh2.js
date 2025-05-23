// 导入 Three.js 库
import * as THREE from 'three';

// 创建一个空的 BufferGeometry 对象，用于存储自定义几何体的顶点数据等信息
const geometry = new THREE.BufferGeometry();

// 定义三个二维向量，用于描述二次贝塞尔曲线的起点、控制点和终点
const p1 = new THREE.Vector2(0, 0);       // 起点
const p2 = new THREE.Vector2(50, 200);    // 控制点
const p3 = new THREE.Vector2(100, 0);     // 终点

// 使用定义的三个点创建一条二次贝塞尔曲线
// p1 是起点，p2 是控制点，p3 是终点
const curve = new THREE.QuadraticBezierCurve(p1, p2, p3);

// 从贝塞尔曲线上获取 21 个点（因为 getPoints(20) 会返回 20+1 个点）
// 这些点将构成线的顶点
const pointsArr = curve.getPoints(20);

// 将从曲线上获取的点数组设置为几何体的顶点位置数据
geometry.setFromPoints(pointsArr);

// 获取几何体的位置属性，其中包含了所有顶点的坐标信息
const positions = geometry.attributes.position;

// 初始化一个空数组，用于存储每个顶点对应的颜色分量 (R, G, B)
const colorsArr = [];

// 遍历几何体的每一个顶点
/* for (let i = 0; i < positions.count; i++) {
  // 计算当前顶点在线条中的相对位置（百分比），范围从 0 到 1
  const percent = i / positions.count;
  // 根据相对位置为顶点设置颜色：R=0, G=percent, B=(1-percent)
  // 这会产生一个从蓝色 (0,0,1) 到青色 (0,1,0) 的渐变效果
  colorsArr.push(0, percent, 1 - percent);
} */

const color1=new THREE.Color('orange')
const color2=new THREE.Color('blue')
for (let i = 0; i < positions.count; i++) {
  const percent=i/positions.count
  const color=color1.clone().lerp(color2,percent)
  colorsArr.push(color.r,color.g,color.b)
}


// 将包含颜色分量的普通数组转换为 Float32Array 类型，这是 BufferAttribute 所需的格式
const colors = new Float32Array(colorsArr);

// 创建一个 BufferAttribute 来存储颜色数据，并将其赋值给几何体的 'color' 属性
// 第二个参数 3 表示每个顶点的颜色由三个分量（R, G, B）组成
geometry.attributes.color = new THREE.BufferAttribute(colors, 3);

// 创建一个基础线条材质（LineBasicMaterial）
const material = new THREE.LineBasicMaterial({
  // 关键属性：启用顶点颜色
  // 这会告诉渲染器使用每个顶点自身定义的颜色，而不是材质的统一颜色
  vertexColors: true
});

// 使用定义的几何体和材质创建一个线条对象（Line）
const line = new THREE.Line(geometry, material);

// 导出创建的线条对象，使其可以在其他模块中被导入和使用
export default line;