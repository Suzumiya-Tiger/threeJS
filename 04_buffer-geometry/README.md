# BufferGeometry

BufferGeometry是Three.js中高性能的几何体表示方式，它直接存储顶点数据到类型化数组中，可以被GPU高效处理。

如何通过BufferGeometry，使用顶点生成各种几何体呢？

老规矩，先构建scene和camera:
```ts
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import mesh from './mesh.js';

const scene = new THREE.Scene()

scene.add(mesh)


const pointLight = new THREE.PointLight(0xffffff, 10000)
pointLight.position.set(80, 80, 80)
scene.add(pointLight)


const axesHelper = new THREE.AxesHelper(300)
scene.add(axesHelper)

const width = window.innerWidth
const height = window.innerHeight

const camera = new THREE.PerspectiveCanmera(60, width / height, 1, 1000)
camera.position.set(200, 200, 200)
camera.lookAt(0, 0, 0)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(width, height)


function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()

document.body.append(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
```



## 解析mesh

把mesh构建抽离出来，单独进行构建:

```typescript
import * as THREE from 'three'

const geometry = new THREE.BufferGeometry()

const vertices = new Float32Array([
  0, 0, 0,
  100, 0, 0,
  0, 100, 0,
  0, 0, 10,
  0, 0, 100,
  100, 0, 10
])

const attribute = new THREE.BufferAttribute(vertices, 3)

geometry.attributes.position = attribute;


const material = new THREE.MeshBasicMaterial({
  color: new THREE.Color('orange')
})

const mesh = new THREE.Mesh(geometry, material)

export default mesh
```



1. 创建一个基础的几何体:

```ts
const geometry = new THREE.BufferGeometry()
```



2. 定义自定义顶点数据:

```typescript
const vertices = new Float32Array([
  0, 0, 0,     // 第一个顶点(0,0,0)
  100, 0, 0,   // 第二个顶点(100,0,0)
  0, 100, 0,   // 第三个顶点(0,100,0)
  0, 0, 10,    // 第四个顶点(0,0,10)
  0, 0, 100,   // 第五个顶点(0,0,100)
  100, 0, 10   // 第六个顶点(100,0,10)
])
```

这是一组 3D 空间中的顶点坐标，每三个数值表示一个点的 X、Y、Z 坐标。



3. 创建缓冲属性对象:

```typescript
const attribute = new THREE.BufferAttribute(vertices, 3)
```

参数3表示每个顶点由3个值组成，这告诉Three.js如何解析顶点数组。这个属性被指定为几何体的position属性，GPU将使用它确定每个顶点的位置。



4. 将自定义的顶点数据应用到创建的几何体上:

```typescript
geometry.attributes.position = attribute;
```

这一步覆盖了原始BoxGeometry的顶点数据，使用我们自定义的顶点数据。



5. 创建基础材质，设置为橙色:

```typescript
const material = new THREE.MeshBasicMaterial({
  color: new THREE.Color('orange')
})
```

MeshBasicMaterial 是一种简单材质，不受光照影响。



6. 创建网格对象，把几何体和材质结合:

```typescript
const mesh = new THREE.Mesh(geometry, material)
```





### Float32Array()

Float32Array()是js提供的TypedArray中众多API的其中一个。

JS提供了ArrayBuffer存储二进制数据，TypedArray可以使用不同类型来读取ArrayBuffer，而我们这里需要存储顶点数据，顶点数据肯定是浮点数类型，这也是使用Float32Array()的原因。

总共定义了6个顶点，就是2个三角形。





## 平面缓冲几何体

我们来创建平面缓冲几何体PlaneGeometry，这个概念就是由平面两个三角形构建成一个正方形的平面图。

```typescript
const vertices = new Float32Array([
  0, 0, 0,
  100, 0, 0,
  0, 100, 0,

  0, 100, 0,
  100, 0, 0,
  100, 100, 0
])
const attribute = new THREE.BufferAttribute(vertices, 3)

geometry.attributes.position = attribute;


const material = new THREE.MeshBasicMaterial({
  color: new THREE.Color('orange'),
  // 展示线框
  wireframe: true
})
```

![image-20250406183943546](/Users/heinrichhu/前端项目/threeJS/04_buffer-geometry/assets/image-20250406183943546.png)

但是这里存在一个问题，两个三角形有6个顶点都是重合的，这会导致了性能浪费，特别是代码里面也存在重合顶点。

所以我们这里延伸出来一个顶点存储优化方案:

存储一份不重复的顶点数据，紧接着存储一份顶点索引的顺序即可。

图中实际使用的不过只有4个顶点，我们这里只需要存储一份索引即可，索引中重复利用这四个顶点。

**这里使用Float32Array类型化数组存储顶点坐标，这种数据结构可以被WebGL直接使用，无需中间转换，提高了性能。**每个顶点占用3个连续的数值，表示x、y、z坐标。

```typescript
const vertices = new Float32Array([
  0, 0, 0,
  100, 0, 0,
  0, 100, 0,

  // 0, 100, 0,
  // 100, 0, 0,
  100, 100, 0
])
const attribute = new THREE.BufferAttribute(vertices, 3)

geometry.attributes.position = attribute;
const indexes = new Uint16Array([
  0, 1, 2, 2, 1, 3
])
geometry.index = new THREE.BufferAttribute(indexes, 1)
```

### 索引优化核心

Uint16Array是TypedArray的API之一，代表了可以存没有符合的16位整数。

这里使用Uint16Array类型化数组存储索引，每个值是对顶点数组的引用。索引告诉GPU如何将顶点连接成三角形：

- 第一个三角形：[0,1,2] 连接顶点0、1、2

- 第二个三角形：[2,1,3] 连接顶点2、1、3

```typescript
geometry.index = new THREE.BufferAttribute(indexes, 1);

```

参数1戴的意思是每一个数组中的元素视作一组。

### 优化效果分析

不使用索引时，绘制这个平面需要定义6个顶点（两个三角形各3个顶点）：

```typescript
三角形1: (0,0,0), (100,0,0), (0,100,0)
三角形2: (0,100,0), (100,0,0), (100,100,0)
```

使用索引后：

1. 只需定义4个唯一顶点
2. 使用索引重用这些顶点
3. 内存使用减少了约33%（从6个顶点减少到4个）
   减少了顶点着色器的计算量
4. 提高了GPU缓存效率



vertices数组包含了4个点的坐标(x, y, z)：

1. (0, 0, 0) - 原点

1. (100, 0, 0) - x轴上距离100单位

1. (0, 100, 0) - y轴上距离100单位

1. (100, 100, 0) - x轴和y轴各100单位

indices数组[0, 1, 2, 2, 1, 3]定义了使用哪些顶点来构建三角形：

- 第一个三角形：顶点0, 1, 2

- 第二个三角形：顶点2, 1, 3

这样就在XY平面上创建了一个由两个三角形组成的正方形。使用索引的BufferAttribute可以通过重复使用顶点来优化内存使用。

###  扩展应用价值

通过 geometry.attributes.position 存储顶点数据，通过 geometry.index 存储顶点索引，每三个顶点索引构成一个三角形，所有的三角形就构成了各种几何体。

模型可能有成千上万个三角形，通过索引优化可以显著减少内存占用和提高渲染性能。

这种优化对WebGL应用尤为重要，因为它直接影响到应用的帧率、响应性和电池使用效率，特别是在移动设备上





## new THREE.BufferAttribute

TypedArray和BufferAttribute在Three.js中都是必要的，原因如下：

1. 数据类型和内存管理：

- 顶点数据(Float32Array)和索引数据(Uint16Array)使用TypedArray是因为WebGL需要强类型的数据结构

- 顶点坐标是浮点数，所以用Float32Array

- 索引是整数，所以用Uint16Array

- 这些TypedArray提供更高效的内存使用和数据传输到GPU

2. BufferAttribute的作用：

- 将TypedArray包装成Three.js能理解的格式

- 为顶点数据提供额外的元数据，如每个顶点包含几个值(3个表示xyz坐标)

- 为索引提供元数据，每个索引值是单个数字(1)

3. 为什么都需要BufferAttribute：

- 顶点数据：geometry.attributes.position = new THREE.BufferAttribute(vertices, 3)

- 这里3表示每个顶点由3个值组成(x,y,z)

- 索引数据：geometry.index = new THREE.BufferAttribute(indexes, 1)

- 这里1表示每个索引是单个值

本质上，BufferAttribute是连接JavaScript数据结构和WebGL所需的GPU缓冲区的桥梁，它告诉Three.js如何解释和使用这些数据，使GPU能高效地渲染几何体

















