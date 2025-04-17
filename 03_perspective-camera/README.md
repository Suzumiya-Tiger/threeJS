# 理解相机透视和视椎体

ThreeJS提供了一个CameraHelper来画视椎体，它是一个模拟视椎相机体的辅助对象，传入camera就可以了:


```typescript
import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(200)
// scene.add(axesHelper)


const width = window.innerWidth
const height = window.innerHeight

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)

camera.position.set(200, 200, 200)

camera.lookAt(0, 0, 0)

const camera2 = new THREE.PerspectiveCamera(20, 16 / 9, 100, 300)
const cameraHelper = new THREE.CameraHelper(camera2)
scene.add(cameraHelper)


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

当你注释掉 camera 时只能看到一个十字标（坐标轴），而 camera2 对应的视锥体消失，是因为渲染函数 renderer.render(scene, camera) 需要使用 camera 参数作为视角来渲染场景。

如果 camera 被注释掉，渲染器就没有有效的视角来正确显示场景中的对象。坐标轴（十字标）可能仍然可见是因为它位于原点或视野范围内的某个位置，但 camera2 的视锥体（由 CameraHelper 创建）需要正确的透视投影才能显示，而这依赖于主相机 camera 的设置。

没有有效的主相机，场景就无法正确渲染所有几何体。

![image-20250406013146992](/Users/heinrichhu/前端项目/threeJS/03_perspective-camera/assets/image-20250406013146992.png)



这里有了一个非常神奇的模型，虽然我已经从事前端开发4-5年了，但是我第一次看到这种三维模型的时候还是感觉到不可思议！

## 理解相机视椎体

回到camera的定义:
```ts
const camera2 = new THREE.PerspectiveCamera(20, 16 / 9, 100, 300)
```

我们可以看到，第一个参数是fov角度，第二个参数是宽高比，第三个参数是近裁界面的距离

![Three.js - Crea entornos interactivos en tu navegador](https://yunevk.github.io/slides-threejs/img/camera-graph.svg)

视椎相机体就是从摄像机的角度去看这个三维立体空间的范围，我们眼睛看到的空间的范围由fov决定，由Near和Far决定我们观察物体的最近面和最远面的距离。
最远面就是透视看到的观察范围的最远点，最近面就是我们设置的观察物体的外围最近的一面。

fov决定了我们观察物体的可视角度的范围。

换个角度来看就是这样的，此时FOV的值是20:
![image-20250406164315066](/Users/heinrichhu/前端项目/threeJS/03_perspective-camera/assets/image-20250406164315066.png)



如果把fov切换为60，可视范围就变大了:
![image-20250406164351729](/Users/heinrichhu/前端项目/threeJS/03_perspective-camera/assets/image-20250406164351729.png)



### camera和camera2的关系

在这个Three.js程序中，两个相机(camera和camera2)扮演着不同的角色：

相机在Three.js中不是一个可见的3D对象或网格(mesh)，而是一个视角定义器，它决定了：

- 你从哪个角度观察场景（相机位置和朝向）

- 你能看到多宽的视野（FOV参数）

- 你能看到多远的距离（near和far参数）

在现实生活中，相机是用来拍摄照片的物理设备，而在Three.js中，相机是一个虚拟的"观察点"，定义了渲染器如何将3D场景投影到2D屏幕上。当你调用renderer.render(scene, camera)时，渲染器会从相机的视角计算场景中的每个可见对象应该如何显示在屏幕上。

没有相机，Three.js就不知道如何展示3D场景。

1. camera - 主相机：

- 负责实际渲染场景，即你在屏幕上看到的视角

- 在render()函数中被用作渲染器的视点：renderer.render(scene, camera)

- 通过OrbitControls可以被用户控制旋转和缩放

2. camera2 - 演示相机：

- 不用于实际渲染，而是作为一个被可视化的对象

- 它的唯一目的是通过cameraHelper在场景中展示一个相机的视锥体

- 它的参数变化只会影响其视锥体的可视化表示，不会改变你看到的场景



3. 为什么看不到camera自身：

camera（主相机）本身在Three.js中不是一个可见的物体。它只是一个定义观察角度的抽象概念，就像你的眼睛——你无法看到自己的眼睛（除非照镜子）。在Three.js中，没有内置的方法可以直接"看见"camera本身，因为它就是你观察场景的视角。

4. camera与camera2的关系：

是的，camera就是一个观察视角，而camera2+cameraHelper组合是被观察的对象。具体来说：

- camera是你的"眼睛"，定义你从哪个位置、以什么角度看场景

- camera2是一个相机定义，但它不用于渲染

- CameraHelper将camera2的视锥体转换为可见的线框模型

- 你通过camera观察这个线框模型，来理解相机视锥体的概念

这个设计很巧妙：使用一个相机(camera)来观察另一个相机(camera2)的视锥体，从而可视化展示相机参数(FOV、宽高比、near、far)如何影响视野范围。这是学习3D图形编程中相机概念的有效方式。



这是一个很好的可视化工具，帮助理解Three.js中相机的工作原理和参数的影响。



### 添加gui相机辅助器

通过gui相机辅助器来调整参数观察物体:
```js
const gui = new GUI()

function onChange() {
  // 更新投影矩阵
  camera2.updateProjectionMatrix()
  // 更新相机辅助器
  cameraHelper.update()
}

gui.add(camera2, 'fov', [30, 60, 10]).onChange(onChange)
gui.add(camera2, 'aspect', {
  '16/9': 16 / 9,
  '4/3': 4 / 3,
  '1/1': 1 / 1
}).onChange(onChange)

gui.add(camera2, 'near', 0, 300).onChange(onChange)
gui.add(camera2, 'far', 300, 800).onChange(onChange)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)

function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
```

这段代码主要是创建了一个图形用户界面(GUI)来实时调整相机参数，并在参数变化时更新相机的显示效果：

1. onChange() 函数：当通过GUI修改相机参数时会被调用

- camera2.updateProjectionMatrix() - 更新相机的投影矩阵，确保参数变化生效

- cameraHelper.update() - 更新相机辅助器的可视化显示

2. GUI控制元素设置：

- gui.add(camera2, 'fov', [30, 60, 10]) - 创建下拉菜单控制相机2的视场角(FOV)

- gui.add(camera, 'aspect', {...}) - 创建下拉菜单控制相机的宽高比(16:9、4:3、1:1)

- gui.add(camera2, 'near', 0, 300) - 创建滑块控制相机2的近裁剪面距离

- gui.add(camera2, 'far', 300, 800) - 创建滑块控制相机2的远裁剪面距离

每个控制元素都通过.onChange(onChange)绑定了参数变化时的回调函数，使得在调整任何参数后能实时更新相机效果。



near是你观察的距离，如果把near设置的值比较大，就会导致物体前面的截面部分就看不到了，超出视椎体的内容部分会被裁截:
![image-20250406170925170](/Users/heinrichhu/前端项目/threeJS/03_perspective-camera/assets/image-20250406170925170.png)



```typescript
  // 更新投影矩阵
  camera2.updateProjectionMatrix()
  // 更新相机辅助器
  cameraHelper.update()
```



这两行代码的具体作用：

1. camera2.updateProjectionMatrix()

- 当相机的参数（视场角FOV、宽高比aspect、近平面near或远平面far）发生变化时，需要重新计算相机的投影矩阵

- 投影矩阵负责将3D场景中的物体正确投影到2D屏幕上

- 如果不调用此方法，改变相机参数后画面不会正确更新

2. cameraHelper.update()

- 相机辅助器(CameraHelper)是一个可视化工具，用线框显示相机的视锥体

- 当相机参数改变后，这个辅助器也需要更新以正确显示新的视锥体形状

- 此方法确保辅助器的几何形状与相机的当前参数保持同步

简而言之，这两行代码确保了当你通过GUI改变相机参数时，相机的内部计算和可视化表示都能正确更新。



