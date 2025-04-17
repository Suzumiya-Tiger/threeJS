# 点模型

我们通过BufferGeometry来生成点模型，这个类型专门用于创建自定义几何体。

创建6组顶点数据，让`geometry.attributes.position`接收通过`new THREE.BufferAttribute(vertices,3)`创建的顶点。

我们这次不创建网格模型Mesh了，而是使用 `new THREE.Points()`来创建点模型。

PointsMaterial也是点模型材质专用的API。

```typescript
import * as THREE from 'three'

const geometry = new THREE.BufferGeometry()

const vertices = new Float32Array([
  0, 0, 0,
  100, 0, 0,
  0, 100, 0,
  0, 0, 100,
  100, 100, 0
])

const attribute = new THREE.BufferAttribute(vertices, 3)
geometry.attributes.position = attribute

const material = new THREE.PointsMaterial({
  color: 0x00ff00,
  size: 10
})
const points = new THREE.Points(geometry, material)

export default points
```

点模型的构建原则如下:

1. 点模型由几何体(geometry)和材质(material)组成

2. 几何体定义了点的位置

3. PointsMaterial定义了点的外观特性

创建点模型的基本步骤：

1. 创建BufferGeometry

2. 定义顶点坐标数组

3. 创建BufferAttribute并设置给几何体

4. 创建PointsMaterial配置外观

5. 创建Points对象

常见初学者容易忘记的步骤：

- 需要将BufferAttribute赋值给geometry.attributes.position

- 点的大小由material的size属性控制

- 点模型最后LINE需要添加到场景中才能显示：scene.add(points)



# 线模型

```TS
import * as THREE from 'three'

const geometry = new THREE.BufferGeometry()

const vertices = new Float32Array([
  0, 0, 0,
  100, 0, 0,
  0, 100, 0,
  0, 0, 100,
  100, 100, 0
])

const attribute = new THREE.BufferAttribute(vertices, 3)

geometry.attributes.position = attribute

const material = new THREE.LineBasicMaterial({
  color: new THREE.Color('orange'),
  linewidth: 10
})

// const line=new THREE.Line(geometry,material)
// 如果你希望自动实现首尾相连，使用LineLoop
const line = new THREE.LineLoop(geometry, material)

export default line
```

![image-20250406233931123](/Users/heinrichhu/前端项目/threeJS/05_point-line-mesh/assets/image-20250406233931123.png)

创建步骤:


1. 首先导入Three.js库

2. 创建一个空的BufferGeometry几何体

3. 定义5个三维空间中的顶点坐标（形成一个几何形状）

4. 创建一个BufferAttribute并赋值给几何体的position属性

5. 创建一个橙色的LineBasicMaterial材质

6. 使用LineLoop代替普通Line，这样会自动连接最后一个点和第一个点形成闭合线条

7. 导出这个线条对象以供其他模块使用

LineLoop与Line的区别在于LineLoop会自动将最后一个顶点与第一个顶点相连，形成一个封闭的循环。

如果你期望两个点构成一条线段，可以使用LineSegments，而且必须要线段数对应的点两两成线，这里只有5个点，只能构成两条线段:

```TS
const line = new THREE.LineSegments(geometry, material)
```



![image-20250406234648108](/Users/heinrichhu/前端项目/threeJS/05_point-line-mesh/assets/image-20250406234648108.png)

你如果多加一条线段，就会变成这样:

```ts
const vertices = new Float32Array([
  0, 0, 0,
  100, 0, 0,
  0, 100, 0,
  0, 0, 100,
  100, 100, 0,
  0, 0, 50
])
```

![image-20250406235859134](/Users/heinrichhu/前端项目/threeJS/05_point-line-mesh/assets/image-20250406235859134.png)

![image-20250406235949033](/Users/heinrichhu/前端项目/threeJS/05_point-line-mesh/assets/image-20250406235949033.png)

线模型的本质就是为了构成线，所以会两两成行。





## BufferGeometry

BufferGeometry是Three.js中非常基础和通用的几何体类，它提供了一种高效的方式来自定义和创建任意几何模型。

BufferGeometry的关键特点：

1. 直接使用类型化数组(TypedArrays)存储顶点数据，性能更高

2. 可以完全自定义顶点位置、法线、UV坐标、颜色等属性

3. 比旧的Geometry类(已弃用)内存占用更小，渲染速度更快
4. 适合创建任何自定义形状，从简单的点、线到复杂的3D模型
5. 可作为点(Points)、线(Line)或网格(Mesh)的基础几何体

所有Three.js中的内置几何体(如BoxGeometry、SphereGeometry等)内部都是基于BufferGeometry实现的。它是创建任何自定义几何形状的基础。





# 网格模型

网格模型前面讲过了，这里不再赘述，只讲一个比较有趣的知识。

```typescript
import * as THREE from 'three';

const geometry = new THREE.BufferGeometry()

const vertices = new Float32Array([
  0, 0, 0,
  100, 0, 0,
  0, 100, 0,
  100, 100, 0
])

const attribute = new THREE.BufferAttribute(vertices, 3)

geometry.attributes.position = attribute

const indexes = new Uint16Array([
  0, 1, 2, 2, 3, 1
])

geometry.index = new THREE.BufferAttribute(indexes, 1)


const material = new THREE.MeshBasicMaterial({
  color: new THREE.Color('orange')
})

const mesh = new THREE.Mesh(geometry, material)

export default mesh
```

这里我们采用的点排列顺序是[0,1,2,2,3,1]。

这里有一个比较有趣的事情，那就是移动滑轨，你会发现正面是紧贴x,y的三角形:
![image-20250408220333162](/Users/heinrichhu/前端项目/threeJS/05_point-line-mesh/assets/image-20250408220333162-4121013.png)

背面则是倒过来的三角形:
![image-20250408220354399](/Users/heinrichhu/前端项目/threeJS/05_point-line-mesh/assets/image-20250408220354399.png)

这是为什么呢？

Three.js中，面朝向（face orientation）是根据顶点连接顺序确定的：

- 逆时针连接的顶点形成正面（front face）

- 顺时针连接的顶点形成反面（back face）

```tex
2 (0,100) --- 3 (100,100)
|              |
|              |
|              |
0 (0,0) ----- 1 (100,0)
```

### 分析两个三角形

1. 第一个三角形 [0,1,2]：

- 从0→1→2：先向右，再向左上

- 这是逆时针方向，所以是正面

1. 第二个三角形 [2,3,1]：

- 从2→3→1：先向右，再向下

- 这是顺时针方向，所以是背面

从不同的视角观察三角形的情况会不同，这就是为什么改变顶点顺序会导致三角形正反面翻转的原因。

从+Z轴方向（正面）看时：

- 三角形[0,1,2]是逆时针的，显示为正面

- 三角形[2,3,1]是顺时针的，显示为背面

从-Z轴方向（背面）看时：

- 同样的顶点顺序[0,1,2]从这个角度看变成了顺时针，所以显示为背面

- 而[2,3,1]从这个角度看变成了逆时针，所以显示为正面

因此，当您绕到模型背面去看时，看不到三角形[0,1,2]，而是看到了三角形[2,3,1]。这是因为从相反方向看，顶点的逆时针/顺时针方向会颠倒，进而导致面的朝向也会翻转。

默认情况下Three.js只渲染正面（material.side = THREE.FrontSide），所以从不同角度看会看到不同的三角形。



### Three.js中的面剔除机制

Three.js默认只渲染三角形的正面，这是通过剔除(culling)背面实现的。这就是关键:

1. 正面定义: 从观察方向看，顶点按逆时针连接的三角形是正面

1. 背面定义: 从观察方向看，顶点按顺时针连接的三角形是背面

1. 默认行为: 只渲染正面，背面被剔除(不渲染)

关键点是:同一个三角形从不同方向看会有不同的旋转方向:

- 从+Z看是逆时针的三角形

- 从-Z看(背面)则变成了顺时针

这就是为什么:

- 从正面看，能看到逆时针定义的三角形[0,1,2]

- 从背面看，这个[0,1,2]变成顺时针，被剔除，所以看不到它

- 而[2,3,1]从正面看是顺时针(背面)，从背面看却变成逆时针(正面)，所以从背面能看到它





## 几何体的分段概念

```typescript
import * as THREE from 'three';

const geometry = new THREE.PlaneGeometry(100, 100, 2, 3)

const material = new THREE.MeshBasicMaterial(({
  color: new THREE.Color('orange'),
  wireframe: true
}))

const mesh = new THREE.Mesh(geometry, material)

console.log('mesh', mesh);

export default mesh

```

在 THREE.PlaneGeometry 中，构造函数的四个参数分别代表：

1. 宽度 (width): 第一个参数是平面的宽度。在你的例子中，宽度为 100。
2. 高度 (height): 第二个参数是平面的高度。在你的例子中，高度也是 100。
3. 宽度分段数 (widthSegments): 第三个参数是将平面在宽度方向上分成的段数。在你的例子中，宽度分段数为 2，这意味着平面将被分成 2 个部分。
4. 高度分段数 (heightSegments): 第四个参数是将平面在高度方向上分成的段数。在你的例子中，高度分段数为 3，这意味着平面将被分成 3 个部分。

因此，THREE.PlaneGeometry(100, 100, 2, 3) 创建了一个宽度为 100，高度为 100，在宽度方向上有 2 个分段，在高度方向上有 3 个分段的平面几何体。

![image-20250408230347000](/Users/heinrichhu/前端项目/threeJS/05_point-line-mesh/assets/image-20250408230347000-4124627.png)

我个人觉得比较有意思的点在于，就是进行了2X3的分段，每个分出来的片段里面还是自动由三角形组成。这大概就是threejs的万物皆可三角形。

另外我们可以从打印细节看到，这个分段几何体实际上是由12个不重复的顶点构成的，它们组成了geometry.attributes.position。

![image-20250408230906435](/Users/heinrichhu/前端项目/threeJS/05_point-line-mesh/assets/image-20250408230906435.png)



他们由36个index构成:



![image-20250408230846525](/Users/heinrichhu/前端项目/threeJS/05_point-line-mesh/assets/image-20250408230846525.png)



为啥要分段呢？如果顶点多了，岂不是会影响渲染的性能吗？
这个问题在这里没有很好的回答，应该去看圆柱几何体CylinderGeometry:

https://threejs.org/docs/index.html?q=Geometry#api/zh/geometries/CylinderGeometry

![image-20250408231511722](/Users/heinrichhu/前端项目/threeJS/05_point-line-mesh/assets/image-20250408231511722.png)



可以看到，分段越多，圆柱整体显得更加圆，而不是本身用了扇形三角型。这也是分段的作用，当然分段越多性能越差。

我们也来写一个圆柱缓冲几何体:
```ts
import * as THREE from 'three'

const geometry = new THREE.CylinderGeometry(50, 50, 80)
const material = new THREE.MeshBasicMaterial({
  color: new THREE.Color('orange'),
  wireframe: true
})
const mesh = new THREE.Mesh(geometry, material)

export default mesh
```

![image-20250408232226039](/Users/heinrichhu/前端项目/threeJS/05_point-line-mesh/assets/image-20250408232226039.png)

1. usBottom): 第二个参数是圆柱体底部的半径。在你的例子中，底部半径也是 50。如果顶部和底部半径相同，圆柱体将是一个规则的圆柱。
2. 高度 (height): 第三个参数是圆柱体的高度。在你的例子中，高度为 80。

因此，THREE.CylinderGeometry(50, 50, 80) 创建了一个顶部和底部半径均为 50，高度为 80 的圆柱几何体。

这里没有进行分段配置，默认圆的分段数是32，高度的分段数是1。这算是官方认为的性能均衡点。





# 总结

### 点模型 (Points)

- 高级应用: 点模型常用于粒子系统、星空、雨雪等效果，通过 PointsMaterial 可设置点的大小、颜色和衰减。

- 性能优势: 渲染大量点时比线或面更高效，适合表现数据可视化或大规模粒子效果。

- 着色器应用: 结合顶点着色器可实现点的动态大小、颜色变化等复杂效果。

### 线模型详解

- Line: 按顺序连接所有顶点，从第一个到最后一个。

- LineLoop: 在Line基础上额外连接最后一个顶点和第一个顶点，形成闭合环。

- LineSegments: 每两个顶点独立连接(0-1, 2-3, 4-5...)，适合绘制不连续的线段集合。

- LineDashedMaterial: 可创建虚线效果，通过设置dashSize和gapSize控制。

### 网格模型 (Mesh) 深入理解

- 面的法线: 每个三角形面都有法线方向，影响光照计算。自动计算的法线对平滑着色至关重要。

- 顶点索引: 多个三角形可共享顶点，通过index属性优化内存使用和渲染性能。

- 双面渲染: 设置material.side = THREE.DoubleSide允许从任何角度查看面，但会增加渲染成本。

- 面剔除: 默认使用material.side = THREE.FrontSide只渲染正面，提高性能。

### 几何体分段与优化

- 自适应细分: 可基于视距动态调整几何体分段，近处细分多，远处细分少。

- LOD (Level of Detail): 使用THREE.LOD对象管理不同细节级别的模型，根据相机距离自动切换。

- instancedMesh: 当需要渲染大量相同几何体时，使用实例化渲染大幅提升性能。

- 合并几何体: 对静态场景，可使用BufferGeometryUtils.mergeBufferGeometries()合并相同材质的几何体减少绘制调用。

### 高级技术

- 变形动画: 通过morphTargets可实现几何体形状间的平滑过渡。

- 顶点着色: 可通过顶点颜色属性给几何体上色，比纹理更灵活且节省内存。

- 计算着色器: 使用WebGL2的计算着色器可在GPU上直接操作大量顶点，实现复杂物理模拟。

- 几何体生成: 通过程序化生成地形、植被等复杂几何体，而非手动建模。

每种模型类型都有其适用场景，选择合适的模型类型和优化策略对创建高效、视觉吸引力强的3D应用至关重要。







