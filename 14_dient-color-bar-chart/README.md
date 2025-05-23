

# 颜色渐变柱状图

## 初步构建坐标轴

这段代码创建了一个 `THREE.Group`，并往其中添加了两条相互垂直的坐标轴线：  
- **x 轴** 白色直线，沿 X 方向；  
- **y 轴** 白色直线，沿 Y 方向。  

通过封装 `createLine(type)` 函数，根据传入的 `'x'` 或 `'y'`，动态生成对应方向的 `THREE.Line` 对象，再统一添加到一个组里，方便整体管理。



```js
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
```

### 关键点解析

1. **THREE.Group**
   - 是一个容器对象，可以将多个 `Object3D`（如 `Mesh`、`Line`）组合在一起，方便统一变换（平移/旋转/缩放）或统一添加/移除。
2. **createLine 函数**
   - 动态生成两点构成的直线：起点固定为 `(0,0,0)`，终点根据 `type` 决定是 X 方向还是 Y 方向。
   - 通过 `geometry.setFromPoints(points)` 快速将 `Vector3` 数组转换为几何体的顶点数据。
3. **BufferGeometry + LineBasicMaterial**
   - `BufferGeometry`：存储顶点位置等数据，适合高效渲染。
   - `LineBasicMaterial`：最简单的线材质，只能设置颜色，不响应光照。
4. **线段渲染**
   - `THREE.Line`：用来绘制折线或直线，三维空间中相邻顶点会顺序连线。
   - 因为只有两个顶点，所以呈现一条单段直线。

这样，你就可以把导出的 `group` 添加到场景，快速看到两条互相垂直的坐标轴线了。