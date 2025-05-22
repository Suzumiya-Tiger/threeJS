# 理解 Three.js

​	1.	**Three.js 的用途**：

​	•	Three.js 是一个用于创建和渲染三维场景的 JavaScript 库，简化了 WebGL 的复杂性，使开发者能够更方便地在浏览器中构建 3D 内容。

​	2.	**三维世界的组成**：

​	•	在 Three.js 中，三维场景由多个物体组成，这些物体通常是网格（Mesh）对象。 

​	3.	**物体的形状和材质**：

​	•	**几何体（Geometry）**：定义了物体的形状和结构。例如，BoxGeometry 创建一个立方体的几何体。 

​	•	**材质（Material）**：定义了物体的外观属性，如颜色、粗糙度、金属感等。例如，MeshBasicMaterial 可以设置物体的基本颜色。

​	•	将几何体和材质结合起来，就形成了一个网格（Mesh）对象，即一个具体的三维物体。 

​	4.	**物体的分组与场景树**：

​	•	**组（Group）**：用于将多个物体组合在一起，形成一个层次结构。例如，可以创建一个 Group 对象，然后通过 add() 方法将多个 Mesh 添加到该组中。

​	•	**场景（Scene）**：是所有物体的根容器，包含了整个三维场景的所有元素。通过将 Group 或 Mesh 添加到 Scene 中，构建出完整的场景树结构。



## threejs的世界

把 Three.js 的核心概念比喻成拍电影的过程：

1. 场景树（Scene）的概念

- 就像电影场景布置一样，所有的道具、演员都要放在场景中

- Three.js 中的场景（Scene）就是一个树形结构，所有的 3D 物体（网格、光源等）都是这棵树的节点

- 这种树形结构让我们可以方便地组织和管理 3D 物体的层级关系

2. 相机（Camera）的概念

- 想象你在拍电影，相机的位置决定了观众看到的画面

- 如果相机在正面，观众看到的是正面画面

- 如果相机在侧面，观众看到的是侧面画面

- Three.js 中的相机就像电影摄像机，它决定了用户看到的视角和范围

3. 灯光（Light）的概念

- 继续用电影拍摄的比喻，片场中需要各种灯光设备

- 打光的位置和强度会影响场景的明暗效果

- 可能需要主光源、环境光、补光等

- Three.js 中的灯光系统就是用来创造这些光影效果的

4. 渲染器（Renderer）的概念

- 这就像电影的后期制作

- 它把所有元素（场景+相机+灯光）组合在一起

- 最终输出到 Canvas 画布上，就像电影最终输出到银幕上



我们先在index.html引入threejs:

```ts
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
        "three": "https://esm.sh/three@0.174.0/build/three.module.js"
      }
    }
  </script>
<script type="module" src="./index.js"></script>
</body>
</html>

```

1. <script type="importmap">

- 这个特殊的 script 标签告诉浏览器："这里定义的是模块导入映射规则"

- 它不包含可执行的 JavaScript 代码，而是包含一个 JSON 配置

2. 映射规则

- "three": 这是你想要使用的简短导入名

- "https://esm.sh/three@0.174.0/build/three.module.js": 这是实际的模块地址

- 用 type="importmap" 的 script 来声明 es module 的包名和 url 之间的映射。

  然后后面就可以直接 import 这个包了。

3. 实际应用

   通过这个映射，就可实现:
   ```js
   // 在你的 index.js 中
   import * as THREE from 'three';
   
   // 创建场景
   const scene = new THREE.Scene();
   // ... 其他 Three.js 代码
   ```

   

# 编写渲染代码

```typescript
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();

// 添加一个漫反射材质的效果
{
  const gemometry = new THREE.BoxGeometry(100, 100, 100)
  const material = new THREE.MeshLambertMaterial(({
    // 设置漫反射效果的颜色
    color: new THREE.Color('orange')
  }))

  // 添加一个立方体
  const mesh = new THREE.Mesh(gemometry, material)
  mesh.position.set(0, 0, 0)
  scene.add(mesh)
}
// 添加一个点光源
{
  // 0xffffff是白色，10000是光照强度
  const pointLight = new THREE.PointLight(0xffffff, 10000)
  // 设置光源位置，立方体长宽高为100，有一个角在50,50,50的位置，距离光线比较近，所以内部那个坐标点发光比较明显
  pointLight.position.set(80, 80, 80)
  scene.add(pointLight)
}
{// 添加展示坐标系的工具AxesHelper
  // 坐标轴长度设置为200
  const axesHelper = new THREE.AxesHelper(200)
  scene.add(axesHelper)
}
{
  const width = window.innerWidth
  const height = window.innerHeight

  // 构建相机视角，在200,200,200的位置，视角为60度，宽高比为width/height，近裁剪面为1，远裁剪面为1000
  /**
   * 第一个参数:角度(fov)，决定了你看的范围有多大
   * 第二个参数:宽高比(aspect)，决定了你看到的画面有多大
   * 第三个参数:近裁剪面(near)，决定了你看到的画面有多近
   */
  const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000)
  camera.position.set(200, 200, 200)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)

  function render() {
    renderer.render(scene, camera)
    // 使用 requestAnimationFrame 来更新控制器，并重新渲染场景。
    // 调用该方法来实现对scene的一帧帧地循环渲染
    requestAnimationFrame(render)
  }
  render()
  document.body.appendChild(renderer.domElement)

  // 创建 OrbitControls 的实例，传入 camera 和 canvas 元素。
  const controls = new OrbitControls(camera, renderer.domElement)

}
```



## 模块导入

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
```

- 导入整个 Three.js 库，使用 THREE 作为命名空间

- 导入轨道控制器 OrbitControls，用于实现交互式的相机控制

## 场景创建

```typescript
const scene=new THREE.Scene()
```

- 创建一个场景对象，它是所有 3D 对象的容器

- 类似于一个虚拟的舞台，所有的物体、灯光都要放在这个舞台上



## 创建立方体

```typescript
{
  const gemometry = new THREE.BoxGeometry(100, 100, 100)
  const material = new THREE.MeshLambertMaterial(({
    color: new THREE.Color('orange')
  }))
  const mesh = new THREE.Mesh(gemometry, material)
  mesh.position.set(0, 0, 0)
  scene.add(mesh)
}
```

- BoxGeometry(100, 100, 100): 创建一个 100×100×100 的立方体几何体

- MeshLambertMaterial: 创建一个漫反射材质

- 这种材质会对光源产生反应，形成明暗效果

- 设置颜色为橙色

- Mesh: 将几何体和材质组合成一个网格对象

- position.set(0, 0, 0): 将立方体放置在坐标原点

- scene.add(mesh): 将立方体添加到场景中



###  BoxGeometry 的参数解析

BoxGeometry(width, height, depth) 接收三个参数：

- 第一个参数 width：沿 X 轴的宽度（这里是 100）

- 第二个参数 height：沿 Y 轴的高度（这里是 100）

- 第三个参数 depth：沿 Z 轴的深度（这里是 100）

因为三个参数都是相等的（都是 100），所以创建的是一个正方体。如果三个值不同，例如 (100, 150, 50)，就会创建一个长方体。

### Three.js 中的其他几何体

如果想创建其他形状，需要使用不同的几何体构造函数：

三角锥（四面体）：

```js
   const geometry = new THREE.TetrahedronGeometry(100); // 半径为100的四面体
```

圆锥体:

```ts
   const geometry = new THREE.ConeGeometry(50, 100, 32); // 底部半径50，高度100
```

球体：

```typescript
   const geometry = new THREE.SphereGeometry(50, 32, 32); // 半径50
```

圆柱体:

```typescript
   const geometry = new THREE.CylinderGeometry(50, 50, 100, 32); // 顶部半径50，底部半径50，高度100
```

环形(甜甜圈):

```typescript
   const geometry = new THREE.TorusGeometry(50, 20, 16, 100); // 环半径50，管粗细20
```





### 网格对象(Mesh)

网格对象（Mesh）是 Three.js 中最常用的渲染实体，它由两个主要部分组成：

- 几何体（Geometry）：定义了物体的形状和结构，包含顶点、面、法线等信息

- 材质（Material）：定义了物体的外观，如颜色、纹理、光照反应等

简单来说，网格就像是一个骨架（几何体）套上了一层皮肤（材质）。它是 Three.js 中用来表示大多数可见物体的基本单位。





## 添加光源

```typescript
{
  const pointLight = new THREE.PointLight(0xffffff, 10000)
  pointLight.position.set(80, 80, 80)
  scene.add(pointLight)
}
```

- 创建一个点光源，类似于一个发光的点

- 0xffffff 表示白色光

- 10000 是光照强度

- 将光源放置在 (80, 80, 80) 的位置

- 这个位置靠近立方体的一个角，所以那个角会更亮



## 添加坐标轴辅助器

```typescript
{
  const axesHelper = new THREE.AxesHelper(200)
  scene.add(axesHelper)
}
```

- 创建一个坐标轴辅助器，长度为 200

- 用于显示三维空间的 X（红）、Y（绿）、Z（蓝）轴

- 帮助理解空间位置关系



## 相机和渲染器设置

```typescript
{
  const width = window.innerWidth
  const height = window.innerHeight

  const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000)
  camera.position.set(200, 200, 200)
  camera.lookAt(0, 0, 0)
  
}
```

- 获取窗口尺寸

- 创建透视相机，参数分别是：

- 60: 视野角度（FOV）

- width/height: 宽高比

- 1: 近裁剪面

- 1000: 远裁剪面

- 将相机放置在 (200, 200, 200) 位置

- 让相机看向原点 (0, 0, 0)

 

### 相机参数详解

#### 视野角度（FOV - Field of View）

- 以角度为单位（通常为度数），表示相机视野的广度

- 类似于人眼或照相机镜头的广角或窄角，如果你用相机的不同焦段拍过照就能理解，这个就是焦段

- 值越大，看到的范围越广，但物体看起来越小

- 值越小，看到的范围越窄，但物体看起来越大

想象一下：

- 60° 是接近人眼的自然视角

- 120° 接近鱼眼镜头，视野非常广

- 30° 像是一个长焦镜头，视野窄但能看得更远



#### 宽高比（Aspect Ratio）

- 表示视口的宽度除以高度

- 通常设置为渲染区域的宽高比

- 保证物体不会变形（拉伸或压缩）

- 如果设置错误，圆形会变成椭圆，正方形会变成长方形

例如：

- 宽高比为 1:1：正方形视口

- 宽高比为 16:9：宽屏显示器的标准比例



#### 近裁剪面（Near Clipping Plane）

- 相机能看到的最近距离

- 近于此距离的物体不会被渲染

- 在您的代码中设为 1，表示相机前方 1 个单位距离

#### 远裁剪面（Far Clipping Plane）

- 相机能看到的最远距离

- 远于此距离的物体不会被渲染

- 在您的代码中设为 1000，表示相机前方 1000 个单位距离



## 渲染器设置和渲染循环

```typescript
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)

  function render() {
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  render()
  document.body.appendChild(renderer.domElement)
```

- 创建 WebGL 渲染器

- 设置渲染尺寸为窗口大小

- 创建渲染循环函数

- requestAnimationFrame 确保平滑渲染

- 将渲染器的 canvas 元素添加到页面中



## requestAnimationFrame 和渲染循环

requestAnimationFrame 是一个浏览器 API，专门为动画设计。它的作用和意义：

1. 优化性能：

- 与 setTimeout 或 setInterval 不同，它会在浏览器准备好重绘时才执行

- 在后台标签页或隐藏的 iframe 中会自动暂停，节省资源

2. 同步显示刷新率：

- 通常会与显示器的刷新率同步（大多是 60fps）

- 避免了撕裂、闪烁等渲染问题

3. 时间控制：

- 提供高精度的时间戳，便于控制动画速度

为什么使用递归调用：

```typescript
function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}
```

- 创建连续渲染循环：3D 场景需要连续更新和重绘

- 响应式渲染：能够响应场景中的变化（如物体移动、相机变化）

- 平滑过渡：保证动画和交互的平滑性

- 资源管理：浏览器可以优化重绘的时机

如果不使用递归调用，场景就只会渲染一次，而不会持续更新。比如当您使用轨道控制器旋转相机时，场景需要不断重新渲染以反映新的视角。

### 循环是如何形成的？

这个函数能够持续执行的关键在于 requestAnimationFrame(render); 这一行。

1. renderer.render(scene, camera);: 这一行代码是实际执行渲染操作的部分，它告诉Three.js渲染器 (renderer) 使用当前的场景 (scene) 和相机 (camera) 来绘制一帧画面。
2. requestAnimationFrame(render);:

- requestAnimationFrame 是一个浏览器提供的API（应用程序编程接口）。它的作用是告诉浏览器：“我希望执行一个动画，并请在下次浏览器重绘屏幕之前，调用我指定的这个函数来更新动画。”

- 在这里，我们传递了 render 函数本身作为参数。这意味着我们请求浏览器在下一次屏幕刷新之前再次调用 render 函数。

**当 render() 首次被调用时（通过代码末尾的 render();）：**

1. **它首先渲染当前帧。**
2. **然后，它调用 requestAnimationFrame(render)，将 render 函数自身注册到浏览器的刷新队列中。**
3. **浏览器在准备下一次屏幕刷新时，会执行队列中的函数，因此 render 函数会再次被调用。**
4. **当 render 函数再次执行时，它又会渲染新的一帧，并再次通过 requestAnimationFrame(render) 请求下一次调用。**

这个过程不断重复，就形成了一个与浏览器刷新频率同步的循环（通常是每秒60次，即60FPS）。这样做的好处是：

- 平滑动画: 渲染与显示器的刷新率同步，可以避免画面撕裂，使动画看起来更流畅。

- 性能优化: 当页面不可见或浏览器标签页在后台时，requestAnimationFrame 会自动降低频率或暂停，从而节省CPU资源和电池寿命。

简单来说，render 函数通过 requestAnimationFrame "预约"了自己下一次的执行，从而实现了持续不断的渲染循环。



![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b043a183c67e43758fbef024f8c9d196~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1478&h=570&s=145195&e=png&b=fefefe)





## 轨道控制器

```typescript
  const controls = new OrbitControls(camera, renderer.domElement)
```

- 创建轨道控制器

- 允许用鼠标交互控制相机：

- 左键拖动：旋转视角

- 右键拖动：平移视角

- 滚轮：缩放视角



轨道控制器是 Three.js 中最常用的相机控制工具，它模拟了围绕目标点旋转的相机行为。

### 基本原理

轨道控制器将相机想象成围绕一个中心点（通常是场景中心）运动的卫星：

- 可以调整相机与中心点的距离（缩放）

- 可以改变相机围绕中心点的角度（旋转）

- 可以移动中心点本身（平移）

### 核心功能

1. 旋转（Rotation）：

- 左键拖动实现相机围绕目标点的旋转

- 调整方式是改变相机的经度和纬度角度

- 默认情况下，相机始终指向目标点

2. 缩放（Zoom）：

- 鼠标滚轮控制相机与目标点的距离

- 放大不是改变相机 FOV，而是真正移动相机位置

- 可以设置最小和最大缩放距离限制

3. 平移（Pan）：

- 右键拖动或按住中键拖动

- 同时移动相机和目标点，保持相对位置不变

- 效果是场景在视野中平移



### 高级设置

轨道控制器有许多可配置选项：

```typescript
// 示例：配置轨道控制器的一些常用属性
controls.enableDamping = true; // 启用阻尼效果（平滑移动）
controls.dampingFactor = 0.05; // 阻尼系数
controls.enableZoom = true;    // 允许缩放
controls.minDistance = 50;     // 最小缩放距离
controls.maxDistance = 500;    // 最大缩放距离
controls.enableRotate = true;  // 允许旋转
controls.enablePan = true;     // 允许平移
controls.autoRotate = false;   // 自动旋转
controls.autoRotateSpeed = 2.0; // 自动旋转速度
```

#### 使用注意事项

1. 需要在动画循环中更新：

如果启用了阻尼效果或自动旋转，需要在每帧更新控制器：

```typescript
   function animate() {
     controls.update(); // 重要！更新控制器
     renderer.render(scene, camera);
     requestAnimationFrame(animate);
   }
```

2. 事件监听：

可以监听控制器的变化事件：

```typescript
   controls.addEventListener('change', function() {
     console.log('相机已移动');
   });
```



3. 自定义交互：

可以自定义哪些鼠标/触摸操作触发哪些行为。

轨道控制器对于交互式 3D 应用非常重要，它让用户能够从各个角度检视场景，大大增强了用户体验。































