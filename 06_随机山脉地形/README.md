# 波动山脉地形DEMO

先构建基础的PlaneGeometry:
```js
import * as THREE from 'three'

const geometry = new THREE.PlaneGeometry(300, 300, 10, 10)

const material = new THREE.MeshBasicMaterial({
  color: new THREE.Color('orange'),
  wireframe: true
})

const mesh = new THREE.Mesh(geometry, material)

console.log('mesh', mesh);

export default mesh

```

THREE.PlaneGeometry(300, 300, 100, 100) 这个构造函数创建了一个平面几何体，它有4个参数：

1. width: 300 - 平面的宽度，沿着X轴方向

1. height: 300 - 平面的高度，沿着Y轴方向

1. widthSegments: 10 - 宽度方向上的分段数量

1. heightSegments: 10 - 高度方向上的分段数量

这里的分段数非常关键 - 它们决定了平面被分割成多少个网格：

- 10个宽度分段意味着在X轴方向上有11个顶点

- 10个高度分段意味着在Y轴方向上有11个顶点

- 总共会创建121个顶点(11×11)

- 形成200个三角形(10×10×2)，因为每个网格由两个三角形组成

在3D图形中，面的渲染通常是基于顶点的绕序(winding order)来决定正面和背面的：

- 逆时针顶点序列通常定义为正面(front face)

- 顺时针顶点序列通常定义为背面(back face)

在您的代码中，可以同时看到平面的正反两面是因为您设置了wireframe: true属性。当使用线框模式时，Three.js会渲染所有的边，而不管它们是正面还是背面，所以您可以看到整个网格结构。



接下来我们可以做一个好玩的事情，我们通过给posistions来设置setZ，随机一个顶点坐标:

```ts
import * as THREE from 'three'

const geometry = new THREE.PlaneGeometry(300, 300, 10, 10)

const positions = geometry.attributes.position

for (let i = 0; i < positions.count; i++) {
  positions.setZ(i, Math.random() * 50)
}

const material = new THREE.MeshBasicMaterial({
  color: new THREE.Color('orange'),
  wireframe: true
})

const mesh = new THREE.Mesh(geometry, material)
mesh.rotateX(Math.PI / 2)
console.log('mesh', mesh);

export default mesh

```



回忆一下主要特性:
positions 是 Three.js 中几何体的一个核心属性，具体指的是 geometry.attributes.position，它存储了几何体中所有顶点的坐标信息。

主要作用：

1. 存储几何体中每个顶点的 x, y, z 坐标值
2. 允许直接访问和修改这些坐标

我们创建了一个平面网格 PlaneGeometry(300, 300, 10, 10)，它有 11×11 个顶点(形成 10×10 个网格)。positions.count 返回顶点的总数。

循环遍历每个顶点，使用 positions.setZ() 方法随机设置每个顶点的 z 坐标（高度），从而将原本平坦的平面变成了一个随机的"山脉"地形。

<img src="/Users/heinrichhu/前端项目/threeJS/06_随机山脉地形/assets/image-20250417231336203.png" alt="image-20250417231336203" style="zoom:50%;" />



这里看起来有山脉的样子，是因为这里设置的分段数比较少，只有10个分段，一旦你把分段改成100，再搞一个真随机数，那就很拉胯了:

```typescript
const geometry = new THREE.PlaneGeometry(300, 300, 10, 10)
```

![image-20250417231457353](/Users/heinrichhu/前端项目/threeJS/06_随机山脉地形/assets/image-20250417231457353.png)

简直和麦田里面的稻子一样。

所以我们应该使用 **连续性的随机**，而不是真正的随机。

这个可以通过simplex-noise插件完成需求，在html里面引入:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
            margin: 0;
        }
    </style>
</head>
<body>
    <script type="importmap">
    {
        "imports": {
            "three": "https://esm.sh/three@0.174.0/build/three.module.js",
            "three/addons/": "https://esm.sh/three@0.174.0/examples/jsm/",
            "simplex-noise": "https://esm.sh/simplex-noise@4.0.3/dist/esm/simplex-noise.js"

        }
    }
    </script>
    <script type="module" src="./index.js"></script>
</body>
</html>

```

紧接着我们可以开始导入noise2D，并且辅助运算:

```TS
import { createNoise2D } from 'simplex-noise'
const geometry = new THREE.PlaneGeometry(300, 300, 100, 100)
const noise2D = createNoise2D()
const positions = geometry.attributes.position

for (let i = 0; i < positions.count; i++) {
  // positions.setZ(i, Math.random() * 50)

  const x = positions.getX(i)
  const y = positions.getY(i)

  const z = noise2D(x / 100, y / 100) * 50
  positions.setZ(i, z)
}
```

![image-20250417233157347](/Users/heinrichhu/前端项目/threeJS/06_随机山脉地形/assets/image-20250417233157347.png)

1. noise2D(x / 100, y / 100) - 使用二维柏林噪声函数来根据顶点的x和y坐标生成值：

- x 和 y 是当前顶点的坐标

- 除以100是用来"缩放"坐标，使噪声效果更加平滑（数值越大，地形起伏越缓慢）

- 噪声函数返回的值在-1到1之间，产生连续且自然的随机值

2. \* 50 - 将噪声值乘以50来放大效果，控制地形的高度范围在-50到50之间

3. positions.setZ(i, z) - 将计算出的高度值(z)设置给当前顶点的z坐标

这种方法比纯粹的随机数（如Math.random() * 50）更适合生成地形，因为柏林噪声会创建平滑过渡的值，形成自然的山峰和山谷，而不是完全无规律的尖刺。这就是为什么地形看起来像真实的山脉，而不是随机的锯齿状表面。



## 添加起伏动态效果

如果我们希望它像大海一样波荡起伏，我们可以考虑为每个顶点添加正弦值，正弦值的范围在-1到1之间:
![image-20250417234645875](/Users/heinrichhu/前端项目/threeJS/06_随机山脉地形/assets/image-20250417234645875.png)

我们可以把当前时间传入来计算正弦，得到的就是一个从-1到1不断变化的值:
```ts
import * as THREE from 'three'
import { createNoise2D } from 'simplex-noise'
const geometry = new THREE.PlaneGeometry(3000, 3000, 100, 100)
const noise2D = createNoise2D()

export function updatePosition() {
  const positions = geometry.attributes.position

  for (let i = 0; i < positions.count; i++) {
    // positions.setZ(i, Math.random() * 50)

    const x = positions.getX(i)
    const y = positions.getY(i)

    // const z = noise2D(x / 100, y / 100) * 50
    // 如果你希望坡度缓一点，可以除数大一点
    const z = noise2D(x / 300, y / 300) * 50
    const sinNum = Math.sin(Date.now() * 0.002 + x * 0.05) * 10
    positions.setZ(i, z + sinNum)
  }
  positions.needsUpdate = true
}

const material = new THREE.MeshBasicMaterial({
  color: new THREE.Color('orange'),
  wireframe: true
})

const mesh = new THREE.Mesh(geometry, material)
mesh.rotateX(Math.PI / 2)
console.log('mesh', mesh);

export default mesh

```

在index.js中导入该函数，并且在render渲染:
```js
function render() {
  updatePosition()  // 每帧更新顶点位置
  // mesh.rotateZ(0.003)
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
```

### 渲染原理

为什么在index.js中导入并调用updatePosition函数:

分离关注点: mesh.js负责几何体创建和顶点操作，index.js负责场景管理和渲染循环

这是Three.js动画的标准模式:requestAnimationFrame请求浏览器在下一次重绘前调用指定函数每次调用render()函数时，先执行updatePosition()更新顶点然后渲染场景，生成新一帧画面再次请求下一帧动画这种方式使得地形会随时间产生波浪效果，呈现出动态的视觉效果。

![image-20250417235542717](/Users/heinrichhu/前端项目/threeJS/06_随机山脉地形/assets/image-20250417235542717.png)
可以通过项目看到这个时候山脉是在波动的。

### 动画效果

这段代码创建了一个波浪动画效果:

1. Date.now() * 0.002 - 获取当前时间戳并缩放，随着时间推移不断变化

2. x * 0.05 - 添加位置偏移，使波浪在空间上有变化(不同x位置的点有不同相位)

3. Math.sin(...) - 生成-1到1之间的正弦值，产生周期性波动
4. \* 10 - 控制波浪振幅(高度)为10个单位
5. positions.setZ(i, z + sinNum) - 将噪声生成的高度值z与波浪高度相加，应用到顶点



### 相位差

可能这里还有人不太理解x*0.05的作用，这里再强调说明一下:
x * 0.05 的作用是创建相位差，这是波浪效果的关键。

#### 如果没有 x * 0.05：

```typescript
const sinNum = Math.sin(Date.now() * 0.002) * 10
```

在任何给定时刻，所有顶点会使用相同的 sin 值，因为 Date.now() 对所有顶点都是相同的。这会导致整个地形像电梯一样整体上下移动。

#### 加入 x * 0.05 后：

```typescript
const sinNum = Math.sin(Date.now() * 0.002 + x * 0.05) * 10
```

这里发生了什么：

1. 每个不同x坐标的点会添加不同的值到sin函数的输入中
2. 例如：

- 当 x=0 时，计算 sin(time + 0)

- 当 x=20 时，计算 sin(time + 1)

- 当 x=40 时，计算 sin(time + 2)

3. 由于正弦函数是周期性的，这些不同的输入值会使不同位置的点处于波浪的不同阶段(峰、谷、上升、下降)

这就产生了空间上的波动，类似于水面波纹，而不是整体上下移动。系数0.05控制了波长 - 值越大，波长越短（波峰之间的距离越近）。





