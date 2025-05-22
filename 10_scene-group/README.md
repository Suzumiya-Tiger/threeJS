# GROUP应用概览

Three.js 之所以支持使用 `Group`（基于 `THREE.Object3D` 的容器）来收集和管理不同的模型，主要是为了让场景以**树状结构**（Scene Graph）的方式组织，对象之间能够继承变换（位置、旋转、缩放），并实现更清晰的代码结构、易于批量操作及性能优化[维基百科](https://en.wikipedia.org/wiki/Scene_graph?utm_source=chatgpt.com)。下面将从场景图原理、`Group` 的作用及优点三方面展开说明。

------

## 场景图（Scene Graph）原理

### 什么是场景图

- **场景图**是一种以节点（Node）和父子关系组织的**树状数据结构**，用于管理三维场景中所有对象的逻辑和空间关系[维基百科](https://en.wikipedia.org/wiki/Scene_graph?utm_source=chatgpt.com)。
- 每个节点（`Object3D` 或其子类）都保存了自身的本地变换矩阵（平移/旋转/缩放），最终渲染时会把父节点的矩阵乘到子节点之上，以得到世界变换矩阵[WebGL 基础知识](https://webglfundamentals.org/webgl/lessons/webgl-scene-graph.html?utm_source=chatgpt.com)。

### Three.js 中的场景图

- Three.js 将所有可添加到场景的对象（如网格、光源、相机、辅助线等）都继承自 `THREE.Object3D`，它们都能拥有 `.children`、`.add()`、`.remove()` 方法，从而形成统一的场景图体系[Engineering LibreTexts](https://eng.libretexts.org/Bookshelves/Computer_Science/Applied_Programming/Introduction_to_Computer_Graphics_(Eck)/05%3A_Three.js-_A_3D_Scene_Graph_API/5.01%3A_Three.js_Basics?utm_source=chatgpt.com)。
- `Scene` 对象本身也是一个特殊的 `Group`，代表整个“宇宙”节点，添加到 `scene` 下的所有对象都会被渲染[Discover three.js](https://discoverthreejs.com/book/first-steps/organizing-with-group/?utm_source=chatgpt.com)。

------

## THREE.Group 的核心作用

### 1. 分组管理与层级变换继承

- `Group` 占据场景图中的一个位置，但自身并不可见，只是一个**逻辑容器**，其所有子对象都会随着它一起平移、旋转或缩放[Discover three.js](https://discoverthreejs.com/book/first-steps/organizing-with-group/?utm_source=chatgpt.com)。
- 例如，将 `house` 所有墙面、屋顶、台阶等放入同一个 `Group`，只需通过一次对 `house.position` 或 `house.rotation` 的修改，就能让整个房屋集体移动或旋转，无需单独调节每个 Mesh[Stack Overflow](https://stackoverflow.com/questions/7985805/three-js-mesh-group-example-three-object3d-advanced/7986386?utm_source=chatgpt.com)。

### 2. 代码组织与可读性提升

- 开发者可根据功能或空间结构，将相关对象放在同一 `Group` 下，如“房屋组”“树木组”“灯光组”等，显著提高代码可读性与维护性[Discover three.js](https://discoverthreejs.com/book/first-steps/organizing-with-group/?utm_source=chatgpt.com)。
- 在调试时，也可方便地折叠/展开分组，快速定位某一部分模型，类似编辑器中的“Outliner”或“对象树”视图[three.js forum](https://discourse.threejs.org/t/ui-element-with-hierarchical-object-tree/24804?utm_source=chatgpt.com)。

### 3. 批量操作与性能优化

- 对一组对象做批量可见性切换（`group.visible = false`）、LOD 切换或剔除（Frustum Culling）时，只需对 `Group` 本身生效即可，无需多次遍历子节点[WebGL 基础知识](https://webglfundamentals.org/webgl/lessons/webgl-scene-graph.html?utm_source=chatgpt.com)。
- 某些渲染管线优化（如合并几何体、GPU 实例化）也要求先将模型按组划分，然后才能一起上传到 GPU，`Group` 提供了天然的逻辑分界[Stack Overflow](https://stackoverflow.com/questions/11320817/using-matrices-to-transform-the-three-js-scene-graph?utm_source=chatgpt.com)。

------

## 小结

1. **基于场景图**：Three.js 核心就是一个**面向场景图的 3D API**，`Group` 是构建场景图的基本单元之一[Engineering LibreTexts](https://eng.libretexts.org/Bookshelves/Computer_Science/Applied_Programming/Introduction_to_Computer_Graphics_(Eck)/05%3A_Three.js-_A_3D_Scene_Graph_API/5.01%3A_Three.js_Basics?utm_source=chatgpt.com)。
2. **继承变换**：通过父子级关系，让子节点自动继承父节点的平移、旋转、缩放，简化繁琐的操作[Discover three.js](https://discoverthreejs.com/book/first-steps/organizing-with-group/?utm_source=chatgpt.com)。
3. **逻辑与性能**：分组管理帮助开发者理清代码逻辑，也有利于批量操作和性能调优[维基百科](https://en.wikipedia.org/wiki/Scene_graph?utm_source=chatgpt.com)。

因此，Three.js 支持使用 `Group` 来收集不同模型，不仅契合图形学中场景图的设计理念，也带来了**更直观的层次结构管理**、**更高效的批量变换**和**更友好的开发与调试体验**。

记住Scene 中保存的是一个对象树，包含 Mesh、Group、Light 等各种对象。



# 坐标

## 局部坐标和世界坐标

在Three.js中，场景中的物体（如Mesh、Group等）构成了一个层级结构，通常称为场景图（Scene Graph）。这种结构允许你将物体组合在一起，并对整个组进行变换（如移动、旋转、缩放），组内的物体会继承这些变换。

你提出的问题涉及到**局部坐标（Local Coordinates）**和**世界坐标（World Coordinates）**的概念：

1. 局部坐标 (Local Coordinates):

- 当你设置一个物体的位置，例如 mesh.position.x = 200，这个坐标是相对于其父对象的。

- 如果一个 mesh 直接添加到 scene 中，那么它的 position 就是相对于场景原点 (0,0,0) 的。

- 如果一个 mesh 被添加到一个 group 中，那么 mesh.position 就是相对于那个 group 的原点的。

2. 世界坐标 (World Coordinates):

- 一个物体在场景中的最终、绝对位置被称为它的世界坐标。

- 这个坐标是通过将物体自身的局部变换（位置、旋转、缩放）与其所有父对象的变换逐级叠加计算得到的。

为什么说添加到 Group 后的绝对坐标是 Group 的 Position 加上它的 Position？

在你的代码中：

```typescript
const group = new THREE.Group();
group.add(mesh); // mesh 成为 group 的子对象
scene.add(group); // group 成为 scene 的子对象

// 设置 group 的世界坐标 (相对于 scene)
group.position.x = 200;
group.translateZ(200); // 这会改变 group.position.z
group.translateY(50);  // 这会改变 group.position.y
// 此时，group 的世界坐标大致为 (200, 50, 200)

// 设置 mesh 的局部坐标 (相对于 group)
mesh.position.x = 200;
// 假设 mesh.position.y 和 mesh.position.z 默认为 0 (相对于 group)

```

要计算 mesh 的世界坐标，我们需要：

1. 获取 group 的世界坐标。在你的例子中，group 直接添加到 scene，所以 group.position (200, 50, 200) 就是它在世界坐标系中的位置。
2. 获取 mesh 相对于 group 的局部坐标。在你的例子中是 mesh.position (200, 0, 0)。
3. 将 mesh 的局部坐标变换到 group 的坐标系下，然后再加上 group 的世界坐标。简单来说，如果只考虑位置（不考虑旋转和缩放的复杂情况），mesh 的世界坐标就是 group 的世界坐标与 mesh 相对于 group 的局部坐标之和。

所以，mesh 的世界坐标大约是：

- X: group.position.x (200) + mesh.position.x (200) = 400

- Y: group.position.y (50) + mesh.position.y (0) = 50

- Z: group.position.z (200) + mesh.position.z (0) = 200

因此，mesh 的世界坐标是 (400, 50, 200)。

“世界坐标”这个名称的由来：

这个术语指的是物体在整个三维场景（或“世界”）中的最终位置和朝向，不受其在场景图层级结构中任何特定父对象的影响。它是所有变换累积的结果，代表了物体在全局共享空间中的状态。每个物体，无论它在层级结构中的深度如何，都有一个唯一的世界坐标（更准确地说是世界变换矩阵，它包含了位置、旋转和缩放信息）。渲染器最终使用这些世界坐标来确定物体在屏幕上的显示位置。

简单来说，你可以把 group想象成一个移动的平台，mesh 放在这个平台上。平台自身在“世界”中有一个位置 (group.position)，而 mesh 在平台上有个相对位置 (mesh.position)。mesh 在“世界”中的最终位置，就是平台在世界中的位置，再加上 mesh 在平台上的位置。



## 观察世界坐标

通过创建一个vector3对象，再通过mesh的getWorldPosition方法，把这个创建的vector3对象作为参数传入，获取mesh的世界坐标:

```js
const pos=new THREE.Vector3();
mesh.getWorldPosition(pos);
console.log(pos);
console.log(mesh.position);
console.log(group.position);
```

同时我们也可以通过AxesHelper来展示group的局部坐标系:

```js
const axesHelper2 = new THREE.AxesHelper(1000);
group.add(axesHelper2);
```



![image-20250522102938057](D:\HeinrichHu\resource\新建文件夹\threeJS\10_scene-group\README.assets\image-20250522102938057.png)



同时我们也可以借助scene的traverse这个api遍历scene中的所有对象:
```js
scene.traverse((obj) => {
    console.log(obj);
});
```

