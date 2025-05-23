import * as THREE from 'three';

// 1️⃣ 创建一个组，用来容纳多条线段
const group = new THREE.Group();

/**
 * 2️⃣ 创建一条直线
 * @param {'x'|'y'} type - 传入 'x' 则生成 X 轴线；'y' 则生成 Y 轴线
 * @returns {THREE.Line} - 返回创建好的线段对象
 */
function createLine(type) {
  // 2.1️⃣ 根据 type 决定第二个点位置：X 轴 (100,0,0) 或 Y 轴 (0,100,0)
  const points = [
    new THREE.Vector3(0, 0, 0),                      // 线段起点：坐标原点
    type === 'y'                                     // 判断 type
      ? new THREE.Vector3(0, 100, 0)                 // 如果是 'y'，终点在 Y 轴正方向 100
      : new THREE.Vector3(100, 0, 0)                 // 如果是 'x'，终点在 X 轴正方向 100
  ];

  // 2.2️⃣ 创建空的 BufferGeometry，用于存储线段的顶点数据
  const geometry = new THREE.BufferGeometry();

  // 2.3️⃣ 用 LineBasicMaterial 设置线的样式：纯白色
  const material = new THREE.LineBasicMaterial({
    color: '#ffffff'
  });

  // 2.4️⃣ 将 points 数组转换为几何体的 position 属性
  geometry.setFromPoints(points);

  // 2.5️⃣ 创建 Line 对象：将几何体和材质组合
  const line = new THREE.Line(geometry, material);

  return line;
}

// 3️⃣ 分别生成 X 轴和 Y 轴线
const xLine = createLine('x');
const yLine = createLine('y');

// 4️⃣ 将两条线添加到组中
group.add(xLine);
group.add(yLine);

// 5️⃣ 导出组对象，方便在场景中直接添加这两条轴线
export default group;