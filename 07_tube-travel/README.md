# 创建模型

## 图片纹理构建流程与原理

```js
// ... (之前的代码，如 path, geometry 的定义) ...

/* 加载纹理图片 */
// 创建一个纹理加载器实例
const loader = new THREE.TextureLoader();
// 使用加载器异步加载 './stone.png' 图片文件，返回一个 Texture 对象
const texture = loader.load('./stone.png');

// 设置纹理在S轴（通常是水平方向）上的包裹方式为重复包裹
// 这意味着当UV坐标超出 [0,1] 范围时，纹理会重复自身
texture.wrapS = THREE.RepeatWrapping;

// 设置纹理的颜色空间为 SRGB，这是Web上图片常用的标准颜色空间
// 确保颜色在渲染时被正确处理
texture.colorSpace = THREE.SRGBColorSpace;

// 设置纹理在X方向（对应S轴或U轴）上的重复次数
// 这会将纹理在模型表面沿U方向平铺20次
texture.repeat.x = 20;

// 创建一个基础网格材质 (MeshBasicMaterial)
// 这种材质不受光照影响，主要由颜色或纹理决定其外观
const material = new THREE.MeshBasicMaterial({
    // map 属性用于指定基础颜色纹理
    // 模型表面的颜色将主要来自这张 'stone.png' 纹理
    map: texture,

    // aoMap (Ambient Occlusion Map) 用于模拟环境光遮蔽，增加模型的深度感
    // 通常 aoMap 是一张灰度图，这里复用了颜色纹理 'texture'
    // 这种用法可能会使纹理的暗部更暗，产生一种特殊的颗粒感或做旧效果，
    // 而不是标准的AO效果。
    aoMap: texture,

    // 设置材质为双面渲染，这样从管道内部也能看到纹理
    side: THREE.DoubleSide
});

// ... (创建 Mesh 并导出的代码) ...
```

在三维图形中，纹理（Texture）本质上是一张2D图片，它被“贴”到3D模型的表面，用来增加模型的细节、颜色和真实感。这个过程通常被称为纹理映射（Texture Mapping）。

核心步骤：

1. 加载纹理图片 (TextureLoader):

- **THREE.TextureLoader 是 Three.js 提供的一个工具类，专门用于加载图片文件（如 .png, .jpg 等）并将其转换为 Three.js 内部可以使用的纹理对象 (THREE.Texture)。**

- loader.load('./stone.png') 这个方法会**异步加载指定路径的图片**。它立即返回一个 THREE.Texture 对象，但图片数据可能还在后台加载。Three.js 会在图片加载完成后自动更新使用该纹理的材质。

1. 配置纹理属性:

- texture.wrapS = THREE.RepeatWrapping;:

- wrapS 控制纹理在水平方向（U轴）上的包裹方式。当模型的UV坐标超出了纹理的 \[0, 1] 范围时，这个属性决定了如何处理。

- THREE.RepeatWrapping 表示纹理会重复平铺。如果UV坐标是1.5，那么会取纹理上0.5位置的颜色。

- 还有一个 wrapT 属性，用于控制垂直方向（V轴）的包裹方式。

- texture.colorSpace = THREE.SRGBColorSpace;:

- 这个属性指定了纹理的颜色空间。SRGBColorSpace 是大多数图片文件（尤其是网络图片）的标准颜色空间。正确设置颜色空间可以确保颜色在渲染时能够被正确地解释和显示，避免颜色失真。

- texture.repeat.x = 20;:

- repeat 是一个 Vector2 对象，控制纹理在U轴 (x) 和V轴 (y) 方向上的重复次数。

- texture.repeat.x = 20 意味着这张纹理图片会在模型的U方向（通常对应几何体的某个自然方向，比如管道的长度方向或周长方向）上重复20次。这使得小块纹理可以覆盖大面积，或者创建重复图案的效果。

1. 将纹理应用到材质 (Material):

- 材质（Material）定义了模型表面的外观属性，例如颜色、光泽度、透明度以及如何与光线交互等。

- map: texture: 这是材质中最重要的纹理属性之一。它将加载的 texture 对象指定为材质的基础颜色纹理（也叫漫反射贴图或反照率贴图）。模型的表面颜色将主要由来于这张纹理图片的像素颜色。

- aoMap: texture (环境光遮蔽贴图):

- aoMap (Ambient Occlusion Map) 是一种特殊的纹理，通常是灰度图。它用于模拟模型表面那些不容易被环境光照射到的区域（如缝隙、角落），使这些区域显得更暗，从而增加模型的深度感和真实感。

- 在这个例子中，将颜色纹理 texture 同时用作 aoMap 是一个不常见的做法，或者说是一个简化的做法。 通常，aoMap 应该是专门制作的灰度图。直接使用颜色纹理作为 aoMap 可能会产生一些意想不到的效果，它会根据颜色纹理的明暗来调整环境光遮蔽的程度，可能会让纹理本身的暗部更暗，亮部对AO贡献较小，从而达到一种“颗粒感”或“做旧”的效果，但这不是标准意义上的环境光遮蔽。

原理简述：UV映射

为了将2D纹理图像正确地贴到3D模型的表面，每个3D模型的顶点都需要有一组2D坐标，这组坐标被称为UV坐标（U和V是纹理坐标轴的名称，以区别于3D空间中的XYZ轴）。

- U坐标通常对应纹理图像的水平方向（从左到右，0到1）。

- V坐标通常对应纹理图像的垂直方向（从下到上或从上到下，0到1）。

当你创建一个几何体（如 TubeGeometry）时，Three.js 会自动为这个几何体生成UV坐标。这些UV坐标定义了纹理图像上的哪个点对应3D模型表面上的哪个点。渲染时，GPU会根据这些UV坐标，从纹理图像中采样颜色（这个颜色单元被称为“texel”），然后将这个颜色应用到模型表面的对应像素上。

texture.repeat.x = 20 实际上是缩放了UV坐标的范围。如果原始UV坐标范围是 \[0, 1]，重复20次后，有效的UV范围就变成了 \[0, 20]。由于设置了 RepeatWrapping，纹理会在每个 \[0, 1] 的区间内重复。

#### texture.repeat.x = 20; 如果超出20，那么模型超出的部分岂不是没有纹理了？

不会的。这里的 texture.repeat.x = 20; 和 texture.wrapS = THREE.RepeatWrapping; 是协同工作的。

- `texture.repeat.x = 20;`：这个设置告诉 Three.js，在模型表面U方向（通常是横向）的UV坐标从0到1的范围内，应该把这张纹理图片重复铺设20遍。想象一下，你有一块瓷砖（你的纹理图片），repeat.x = 20 意味着在模型的一个“标准宽度”上，你要并排铺设20块这样的瓷砖。这实际上是把纹理图案缩小了，让它在有限的空间内重复更多次。

- texture.wrapS = THREE.RepeatWrapping;：这个设置定义了当UV坐标超出了标准宽度 \[0, 1] 范围后应该如何处理。THREE.RepeatWrapping 意味着纹理会无限重复。

结合起来理解：

texture.repeat.x = 20 使得纹理在基础UV空间 \[0,1] 内被“压缩”并重复了20次。如果模型的UV坐标本身就超出了这个 \[0,1] 的范围（比如UV坐标从0到2），那么 THREE.RepeatWrapping 会确保纹理继续重复。

所以，模型不会有没有纹理的部分。texture.repeat.x = 20 控制的是纹理图案在模型单位表面的重复密度，而 texture.wrapS = THREE.RepeatWrapping 确保了无论模型的UV坐标如何延展，纹理都会持续平铺下去。你看到的会是这张石头纹理以更高的频率重复出现在管道表面。

**texture.repeat.x 的值（比如20）不是像素单位。**

它是一个乘数因子，作用于纹理坐标(UV坐标)。

- UV坐标是归一化的，通常范围是从0到1。U代表纹理的横向，V代表纹理的纵向。

- texture.repeat.x = 1 (默认值) 意味着纹理图片在模型的U方向上完整地贴一次（假设模型的UV正好是从0到1）。

- texture.repeat.x = 20 意味着纹理图片在模型的U方向上，原本贴一次的空间现在要贴20次。这等效于将纹理在U方向上缩小到原来的1/20，然后平铺。

最终在屏幕上显示的像素大小，取决于纹理图片本身的分辨率、模型的大小、模型的UV映射方式以及相机视角等多种因素。repeat属性只控制纹理坐标的缩放和重复。

#### 既然已经设置了 texture.wrapS = THREE.RepeatWrapping;，为什么还需要 texture.repeat.x = 20; 来设置重复贴图？

两个属性控制的是纹理贴图行为的不同方面：

- texture.wrapS = THREE.RepeatWrapping; (包裹方式 - How):

- 这个属性回答的是：“当纹理坐标超出了 \[0,1] 这个标准范围时，应该怎么做？”

- THREE.RepeatWrapping 的答案是：“重复使用这张纹理。”

- 其他选项还有 THREE.ClampToEdgeWrapping (拉伸边缘像素) 和 THREE.MirroredRepeatWrapping (镜像重复)。

- 它本身并不决定纹理在一开始（在UV [0,1] 范围内）会显示多少次。

- texture.repeat.x = 20; (重复次数/缩放 - How many/How scaled):

- 这个属性回答的是：“在几何体表面定义的基础UV空间 \[0,1] 内，这张纹理应该重复多少次？” 或者说 “这张纹理应该被缩放到什么程度？”

- 当 repeat.x = 1 时，纹理在U方向铺满一次。

- 当 repeat.x = 20 时，纹理在U方向被“压缩”了，使得它在同样的表面区域内重复了20次。

- 你可以把它理解为调整纹理图案在模型表面的“密度”或“大小”。

简单来说：

- texture.repeat.x = 20; 决定了纹理图案的大小和在基础UV单元内的重复频率。它让你的石头纹理看起来更小，更密集。

- texture.wrapS = THREE.RepeatWrapping; 确保了这种由 repeat.x 定义的重复模式能够无限延伸下去，覆盖整个模型表面，即使模型的UV坐标延展很大。

如果只有 texture.wrapS = THREE.RepeatWrapping; 而 texture.repeat.x 是默认的1，那么纹理只会在模型的UV坐标超出 \[0,1] 范围时才开始重复，并且是以其原始大小重复。通过设置 texture.repeat.x = 20;，你使得纹理在模型的任何部分都以20倍的频率重复出现，从而达到更细致或特定视觉效果的目的。



## 实现动画穿梭效果的原理

如果我们想实现在管道中自动穿梭的动画效果，我们应该给管道采样1000个点:

```js
// 在管道路径上均匀采样1000个点

export const tubePoints=path.getSpacedPoints(1000);
```

![image-20250516155500085](D:\HeinrichHu\resource\新建文件夹\threeJS\07_tube-travel\README.assets\image-20250516155500085.png)
path.getSpacedPoints(nums)会自动实现均匀采样1000个包含(x,y,z)坐标轴的点。



将其导出，在index.js中实现动画效果:

```js
function render() { // 定义每一帧的渲染逻辑
  // console.log('tubePoints', tubePoints); // 用于调试，可以打印出路径点信息

  // 检查索引 i 是否还在 tubePoints 数组的有效范围内
  // 需要确保 i+1 也是有效的，因为 camera.lookAt 会使用下一个点
  if (i < tubePoints.length - 1) {
    // 将相机的位置 (camera.position) 更新为当前路径点 (tubePoints[i])
    // .copy() 方法用于复制向量值，避免直接引用导致意外修改
    camera.position.copy(tubePoints[i]);

    // 让相机朝向 (lookAt) 路径上的下一个点 (tubePoints[i+1])
    // 这会调整相机的旋转，使其镜头对准目标点
    camera.lookAt(tubePoints[i+1]);

    // 索引递增，以便下一帧处理路径上的下一个点
    i += 1;
  } else {
    // 如果已经到达路径的末尾（或接近末尾，使得 i+1 无效）
    // 则将索引 i 重置为 0，使动画从路径起点重新开始
    i = 0;
  }
```

这个动画效果的核心思想是：逐帧改变相机（观察者的视角）在三维空间中的位置和朝向。

1. export const tubePoints = path.getSpacedPoints(1000); (mesh.js)

- 这行代码在 mesh.js 中，我们之前创建管道时用到的 path (一条 THREE.CatmullRomCurve3 曲线)有一个方法叫做 getSpacedPoints(divisions)。

- path.getSpacedPoints(1000) 会沿着这条曲线路径，均匀地采样出1000个点。这些点在路径上的间距是大致相等的。

- tubePoints 因此变成了一个包含1000个 THREE.Vector3 对象的数组，每个对象代表路径上的一个三维坐标点。这些点从路径的起点到终点依次排列。

1. 动画循环 (render 函数 in index.js)

- 在 index.js 的 render 函数中（通常这个函数会被 requestAnimationFrame 循环调用，以实现动画效果），每一帧都会执行以下操作：

- 获取当前点和下一个点：使用一个索引 i 来追踪当前在 tubePoints 数组中的位置。

- 更新相机位置：camera.position.copy(tubePoints[i]);

- 将相机的位置直接设置到 tubePoints 数组中第 i 个点的位置。

- 更新相机朝向：camera.lookAt(tubePoints[i+1]);

- **让相机始终朝向 tubePoints 数组中第 i+1 个点（即路径上的下一个点）。这确保了相机的视线方向始终是沿着管道前进的方向。**

- 递增索引：i+=1;

- **在下一帧，相机将移动到路径上的下一个采样点。**

- 循环：if(i < tubePoints.length - 1) { ... } else { i = 0; }

- 当索引 i 到达 tubePoints 数组的末尾（倒数第二个点，因为 lookAt 需要 i+1），就将 i 重置为0。这样相机就会回到管道的起点，动画从头开始循环播放，实现了无限穿梭的效果。

总结：通过将相机的位置逐帧地移动到预先计算好的路径点上，并使其朝向路径的下一个点，就模拟出了在管道中平滑前进的视觉效果。采样点的数量（这里是1000）决定了动画的平滑程度，点越多，动画看起来就越流畅。

