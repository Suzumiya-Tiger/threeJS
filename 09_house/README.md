# 构建组

```js
import * as THREE from 'three';
import foundation from './foundation.js';

// 创建一个组，将基础添加到组中
const house = new THREE.Group();

house.add(foundation);

export default house;
```

创建一个组，然后陆续把各个形状的物体拼合到这个组里面。

# 地基

```js
import * as THREE from 'three';

// 我们用 Group 来添加一组物体，首先用 BoxGeometry 创建了地基。
// 然后创建了漫反射材质，最后用 Mesh 将地基和材质结合在一起。
// 最后将地基添加到组中。
const geometry=new THREE.BoxGeometry(4000,300,3000)
// MeshLambertMaterial 漫反射材质
const material=new THREE.MeshLambertMaterial({
  color:new THREE.Color('grey')
})

const foundation=new THREE.Mesh(geometry,material)

export default foundation

```

通过new一个THREE.BoxGeometry来创建一个立方体，在三个方向轴上面构建支点。

然后将其导入到组里面。

![image-20250519151410094](D:\HeinrichHu\resource\新建文件夹\threeJS\09_house\README.assets\image-20250519151410094.png)



# 外墙

## 构建思路

**定义二维轮廓**：使用 `THREE.Shape` 构造一个平面上的多边形轮廓，通过一系列 `moveTo`/`lineTo` 方法依次连接各个顶点，最终形成闭合路径 [threejs.org](https://threejs.org/docs/api/en/extras/core/Shape.html?utm_source=chatgpt.com)。

**生成三维几何体**：将上述二维轮廓传入 `THREE.ExtrudeGeometry`，沿 Z 轴“挤出”指定深度，自动创建侧面和封顶面，得到可用于渲染的 3D 几何体 [threejs.org](https://threejs.org/docs/api/en/geometries/ExtrudeGeometry.html?utm_source=chatgpt.com)。





```js
import * as THREE from 'three';

// —— 1. 创建一个空的二维形状（Shape）
const shape = new THREE.Shape();          
// moveTo(x, y)：将“画笔”移动到起始点 (0, 0)
shape.moveTo(0, 0);                       

// lineTo(x, y)：从当前点绘制一条直线到给定坐标
shape.lineTo(0, 2000);    // 向上画到 (0, 2000) :contentReference[oaicite:2]{index=2}
shape.lineTo(-1500, 3000);// 斜线到左上角 (-1500, 3000) :contentReference[oaicite:3]{index=3}
shape.lineTo(-3000, 2000);// 继续向左下画到 (-3000, 2000) :contentReference[oaicite:4]{index=4}
shape.lineTo(-3000, 0);   // 回到底部左侧 (-3000, 0)，完成闭合轮廓 :contentReference[oaicite:5]{index=5}

// —— 2. 将二维轮廓挤出为三维几何体
const geometry = new THREE.ExtrudeGeometry(
  shape,               // 传入上面定义的 Shape
  {
    depth: 100         // 挤出深度（沿 Z 轴方向）为 100 单位 :contentReference[oaicite:6]{index=6}
  }
);

// 后续可配合材质(Material)和网格(Mesh)渲染到场景中：
// const material = new THREE.MeshLambertMaterial({ color: 'lightgrey' });
// const sideWall = new THREE.Mesh(geometry, material);
// scene.add(sideWall);
export default sideWall;

```



### 关键点回顾

- **`THREE.Shape`**
  - 定义了一个任意的 2D 轮廓（可包含多个子路径及洞） [threejs.org](https://threejs.org/docs/api/en/extras/core/Shape.html?utm_source=chatgpt.com)。
  - `moveTo` 用于设置起点，`lineTo` 用于绘制直线路径。
- **`THREE.ExtrudeGeometry`**
  - 接收一个 `Shape`，并根据配置参数在 Z 轴方向“拉伸”该形状，从而生成带有侧面和封顶面的完整立体几何体 [threejs.org](https://threejs.org/docs/api/en/geometries/ExtrudeGeometry.html?utm_source=chatgpt.com)。
  - 参数 `depth` 决定了挤出的高度，其他高级选项还包括 bevel（倒角）、曲面分段数等。

通过上述两步，你就能从一个简单的二维多边形草图，快速生成在 Three.js 场景中可渲染的三维立体对象。





## 绘制窗户

### 概览

在 Three.js 中，`THREE.Shape` 用于定义二维轮廓，默认会生成一个实心的平面或挤出体。
 通过向 `shape.holes` 数组中添加一个或多个 `THREE.Path` （或 `THREE.Shape`）对象，便可以在原轮廓中“挖空”出对应区域，最终在生成几何体时出现窗户、孔洞等空心效果[threejs.org](https://threejs.org/docs/?utm_source=chatgpt.com)[threejs.org](https://threejs.org/docs/api/en/extras/core/Shape.html?utm_source=chatgpt.com)。



### 代码解析

```js
// —— 创建窗户的二维路径（Path）
const windowPath = new THREE.Path();

// 定义窗户轮廓的四个顶点（逆时针或顺时针均可），
// 这里移动到左下角 (-600, 400)，然后依次画到左上、右上、右下
windowPath.moveTo(-600, 400);   // 起点：窗户左下角 :contentReference[oaicite:2]{index=2}
windowPath.lineTo(-600, 1600);  // 向上到窗户左上角 :contentReference[oaicite:3]{index=3}
windowPath.lineTo(-2400, 1600); // 向左到窗户右上角 :contentReference[oaicite:4]{index=4}
windowPath.lineTo(-2400, 400);  // 向下回到窗户右下角 :contentReference[oaicite:5]{index=5}

// —— 将窗户路径当作“孔”加入到主 Shape 的 holes 数组
shape.holes.push(windowPath);   // shape.holes 接受 Path/Shape，表示要从主轮廓中挖空:contentReference[oaicite:6]{index=6}

```

**`THREE.Path` vs `THREE.Shape`**
 `Path` 只能定义路径，不支持直接挤出；但它可以作为“孔”加入到 `Shape` 的 `holes` 数组，由 `ExtrudeGeometry` 或 `ShapeGeometry` 识别并挖空[Stack Overflow](https://stackoverflow.com/questions/28532878/three-js-punch-hole-in-shape-with-another-shape?utm_source=chatgpt.com)。

**逆时针/顺时针方向**
 Three.js 在内部会根据路径的绘制方向（正向 vs 反向）来判断哪些是外轮廓、哪些是孔洞。通常将主轮廓按一种方向（如顺时针）绘制，将孔洞按相反方向绘制，可保证算法正确识别[Stack Overflow](https://stackoverflow.com/questions/28532878/three-js-punch-hole-in-shape-with-another-shape?utm_source=chatgpt.com)。



### 原理剖析：为什么会空心

1. **`shape.holes` 数组的含义**
    Three.js 文档中说明，`Shape` 对象拥有一个 `holes` 属性，类型为 `Array<Path>`，用来存放所有需要在主轮廓上挖出空洞的子路径[threejs.org](https://threejs.org/docs/api/en/extras/core/Shape.html?utm_source=chatgpt.com)。
2. **生成几何体时的处理**
   - 当你将 `shape` 传给 `new THREE.ExtrudeGeometry(shape, settings)` 或 `new THREE.ShapeGeometry(shape)` 时，Three.js 会先对主轮廓和所有孔洞进行 **二维三角剖分**，生成一个带洞的平面网格。
   - 接着，若是挤出（Extrude）操作，则在 Z 轴方向同样对孔洞区域不生成侧面和顶面，从而在最终的立体模型上形成真实的洞口[three.js forum](https://discourse.threejs.org/t/add-hole-to-geometry-face/58794?utm_source=chatgpt.com)。
3. **效果展示**
   - **无 holes**：生成的几何体是实心的，没有任何洞口。
   - **有 holes**：在对应的窗户路径区域，几何体会“打掉”一块，形成窗户般的透明区域，其他部分正常渲染。

#### 小贴士

- 如果孔洞反而变成实心，或出现渲染异常，通常是因为路径方向不一致，或者某些顶点坐标有误导致算法无法正确识别；可以尝试 **反转孔洞路径** 的点顺序（`.reverse()`）来修正[Stack Overflow](https://stackoverflow.com/questions/28532878/three-js-punch-hole-in-shape-with-another-shape?utm_source=chatgpt.com)。
- 除了矩形孔洞，`holes` 数组也支持任意复杂曲线，如圆形、文本轮廓等，使用 `THREE.Path` 或 `THREE.Shape` 都可[three.js forum](https://discourse.threejs.org/t/how-can-i-create-a-hole-in-a-geometry-with-text/47487?utm_source=chatgpt.com)。



## 绘制坐标轴思路

在 Three.js 里，`THREE.Shape`（和 `THREE.Path`）的所有 `moveTo`／`lineTo` 调用，都是在它自己的**二维平面坐标系**（也就是 Shape 的“画布”）上进行的，而不是直接用场景（Scene）的三维世界坐标系。具体来说：

1. **Shape 的坐标系**
   - 当你写 `const shape = new THREE.Shape()` 时，Three.js 给了它一个默认的二维坐标系，通常我们把它看作是 XY 平面（Z=0）。
   - `shape.moveTo(x, y)`、`shape.lineTo(x, y)` 就是在这个平面上，按照你提供的 `(x,y)` 坐标把线段或曲线连起来。
   - 这些坐标值只是这个形状内部的“像素位置”——它们不会马上映射到世界坐标里，而是先定义了一个扁平的轮廓。
2. **ExtrudeGeometry 是怎样把二维「画布」变成三维模型的**
   - 调用 `new THREE.ExtrudeGeometry(shape, { depth: 100 })` 时，Three.js 会先把你在 Shape 上画好的那条闭合路径当作「截面」，然后沿着 Z 轴（本地的“第三维”）把它拉出 100 个单位。
   - 最终生成的所有顶点，都是先把你在 Shape 上写的 `(x,y)` 变成几何体的 X、Y 分量，再给每个顶点加上一个 Z 分量（从 0 到 depth）——然后才把整段几何体按你的 `Mesh`/`Object3D` 的位置、旋转、缩放，放到场景里去。
3. **所以你看到的「窗户」那套坐标轴**
   - 那是一张你在 Shape 平面上画图时用的二维参考系。Three.js 根本不会在你调用 `moveTo(-600, 400)` 的时候，就把它映射到世界坐标的 X 或 Y 轴上。
   - 只有当你把这个 `geometry` 构造成 `Mesh` 并添加到场景后，它才会整体地被当作一个三维物体，遵循 Mesh 本身在场景里的位置／旋转／缩放来渲染。

------

### 类比

想象你在电脑上用 Photoshop 先画了一个「窗户」的轮廓，这个轮廓是在 Photoshop 的画布坐标里 （像素坐标）。画好以后，你把它导入到 3D 建模软件里，告诉它「沿 Z 轴拉深 100 单位」。此时你 Photoshop 里的像素坐标，就对应了模型的局部 X、Y，而不是直接对应 3D 世界坐标的 X、Y。

------

**核心结论**：

- `shape.holes`、`moveTo`、`lineTo` 等都是在 **Shape 的本地二维平面坐标系** 上操作。
- 只有经过 `ExtrudeGeometry`（或 `ShapeGeometry`）生成几何体，并放进 `Mesh` 加入场景后，整片几何体才“统一”成为场景里的三维对象，才会受世界坐标系的定位影响。

**`THREE.Shape` 建立的是一个独立的二维平面坐标系，你在它上面调用的所有 `moveTo` / `lineTo`、添加 `holes` 等操作，都是针对这个 Shape 自己的“画布”（也就是本地的 XY 平面）来做的，和场景（Scene）里的三维世界坐标系相互独立 [threejs.org](https://threejs.org/docs/api/en/extras/core/Shape.html?utm_source=chatgpt.com)。**

当你把这个 Shape 传给 `new THREE.ExtrudeGeometry(shape, …)` 时，Three.js 会把你在 Shape 平面上定义的 (x,y) 当作该几何体的本地 X、Y 坐标，然后再沿本地 Z 轴“拉伸”出深度，最终生成一个放到场景里的 3D 模型 [threejs.org](https://threejs.org/docs/api/en/geometries/ExtrudeGeometry.html?utm_source=chatgpt.com)。

而 `THREE.BoxGeometry(width, height, depth)` 则是直接在 **世界坐标系**（或者说 Mesh 的父空间坐标系）里，沿着 X、Y、Z 三个轴，各自从中心点向两边延伸固定尺寸后形成一个立方体缓冲几何体，它没有独立的“二维画布”概念，所有顶点坐标一开始就已经和世界坐标系对齐 [threejs.org](https://threejs.org/docs/api/en/geometries/BoxGeometry.html?utm_source=chatgpt.com)。

### 对比小结

| 特性                     | THREE.Shape                                    | THREE.BoxGeometry                                    |
| ------------------------ | ---------------------------------------------- | ---------------------------------------------------- |
| 坐标系类型               | 独立的二维平面（本地 XY）                      | 三维缓冲几何，直接在父空间 XYZ 对齐                  |
| 定义轮廓／顶点的方式     | 通过 `moveTo` / `lineTo` / `holes` 等 API      | 通过构造参数 `width, height, depth`                  |
| 进一步“绘制”或“打孔”基准 | 始终以 Shape 自己的平面坐标为参考              | 无额外“绘制”操作；若要修改需直接改顶点或使用布尔运算 |
| 转换为 3D 模型           | 需借助 `ExtrudeGeometry`（或 `ShapeGeometry`） | 已经是 3D 模型，可直接用于 `Mesh`                    |



因此，**只要在 `new Shape()` 上调用后续的路径方法或添加 `holes`，它们就永远是在这个 Shape 的本地 XY 平面里工作**；与之相反，`BoxGeometry` 直接就生成了一个在场景坐标系里对齐的立方体。这样设计正是为了把“二维轮廓绘制”与“三维场景构建”这两个概念分离开来，更加模块化和灵活



## 贴图

```js
import * as THREE from 'three';

// —— 1. 创建一个纹理加载器，用于加载外部图片资源
const loader = new THREE.TextureLoader();

// —— 2. 用加载器加载本地的墙面贴图（砖块纹理）
//    注意：路径根据你的项目结构可能需要调整
const texture = loader.load('./zhuan.jpg');

// —— 3. 设置贴图的色彩空间
//    默认贴图是线性空间，设置为 sRGB 空间可以保证在物理光照下颜色更自然
texture.colorSpace = THREE.SRGBColorSpace;

// —— 4. 设置贴图在水平方向（S 轴）上的重复模式
//    RepeatWrapping 表示超过 [0,1] 区间后的纹理会重复平铺
texture.wrapS = THREE.RepeatWrapping;

// —— 5. 设置贴图在 S 轴上重复的次数
//    repeat.x = 2 表示将纹理在 X 方向重复两次
texture.repeat.x = 2;



// —— 6. 创建一个 BoxGeometry（长方体几何体）
//    参数：宽度 4000，高度 2000，深度 100
const geometry = new THREE.BoxGeometry(4000, 2000, 100);

// —— 7. 创建一个支持光照的 Lambert 漫反射材质
const material = new THREE.MeshLambertMaterial({
  // 如果你想用纯色，可以取消下面两行注释，使用浅灰色：
  // color: new THREE.Color('lightgrey'),

  // 用加载好的贴图作为漫反射纹理（map）
  map: texture,

  // 同样用它作为环境光遮蔽贴图（aoMap），增强凹陷部分的阴影效果
  aoMap: texture
});

// —— 8. 用几何体和材质创建一个网格对象
const behindWall = new THREE.Mesh(geometry, material);

// —— 9. 将墙体稍微向上抬升 1150 单位，避免与地面重合
behindWall.translateY(1150);

// —— 10. 向场景后方（-Z 方向）移动 1450 单位，放置在房屋后墙位置
behindWall.translateZ(-1450);

// —— 11. 导出这个后墙对象，以便在主场景或 “house” 组里使用
export default behindWall;

```

### 关键点讲解

1. **`TextureLoader` 与贴图属性**
   - `THREE.TextureLoader` 可以异步加载图片，得到一个 `Texture` 对象。
   - `colorSpace = SRGBColorSpace` 用于告诉渲染器这张贴图是 sRGB 色彩空间，Three.js 在做光照混合时会自动线性化处理，使颜色看起来更真实。
   - `wrapS / wrapT` 决定纹理超出 [0,1] 的 UV 坐标时如何处理，`RepeatWrapping` 会平铺，而不是拉伸或重复最后一像素。
   - `repeat.x / repeat.y` 控制在各方向上重复的次数，相当于在几何体表面平铺纹理。
2. **`map` vs `aoMap`**
   - `map`：漫反射贴图，决定大部分表面颜色。
   - `aoMap`：环境光遮蔽贴图，强调凹凸和阴影区域，增强细节和立体感。这里直接复用同一张贴图，也能在一定程度上产生更深的“裂缝”或“凹陷”暗影。
3. **几何体与变换**
   - `BoxGeometry(4000,2000,100)` 指定了后墙的长宽厚。
   - `translateY` / `translateZ` 方法是几何体自身的平移，也可在 Mesh 上直接修改 `position`。这里把墙体抬高再往后移，是为了快速放到房屋的后方并略微抬高，避免穿插到地面里。

### 侧墙纹理

```typescript
const loader=new THREE.TextureLoader();
const texture=loader.load('./assets/zhuan.png')
texture.colorSpace=THREE.SRGBColorSpace;
texture.wrapS=THREE.RepeatWrapping;
texture.repeat.x=0.0005;
texture.repeat.y=0.0005;
```

 前面我们讲的主墙的几何体是BoxGeometry，默认 uv 坐标就是从 0,0 到 1,1 的坐标，通过这个来映射纹理贴图上对应位置的颜色。

1. behind-wall.js (BoxGeometry):

- 在这个文件中，你使用了 THREE.BoxGeometry(4000, 2000, 100)。

- **对于 BoxGeometry 这样的基础几何体，Three.js 会自动为每个面生成UV坐标。这些UV坐标通常是标准化的，意味着它们在每个面的U（水平）和V（垂直）方向上的范围大致是从 0 到 1。**

- 当你设置 texture.repeat.x = 2 时，意味着在纹理的U方向上，它会在这个0到1的UV空间内重复两次。如果几何体的某个面在U方向的UV是从0到1，那么纹理坐标实际上会从0映射到2，使得纹理图案在该面上重复显示两次。

2. side-wall.js (ExtrudeGeometry):

- 在这个文件中，你使用了 THREE.ExtrudeGeometry，它是基于一个二维 Shape 对象挤压而成的。

````js
        // 1. 创建一个空的二维形状（Shape）
        const shape = new THREE.Shape();
        // moveTo：将“画笔”移动到起始点 (0, 0)
        shape.moveTo(0, 0);
        // lineTo：从当前点画一条直线到 (0, 2000)
        shape.lineTo(0, 2000);
        // 继续画线到 (-1500, 3000)
        shape.lineTo(-1500, 3000);
        // 再画线到 (-3000, 2000)
        shape.lineTo(-3000, 2000);
        // 最后一条线回到 (-3000, 0)，完成闭合轮廓
        shape.lineTo(-3000, 0);
````

- **对于 ExtrudeGeometry，默认情况下，UV坐标是根据你定义的二维 Shape 的顶点坐标直接生成的。U坐标通常对应于原始 Shape 的X坐标，V坐标对应于原始 Shape 的Y坐标。**

- 从你的代码和提供的截图（uv: Float32BufferAttribute 下的 array 显示了 -2400, 1600, -2400, 400 等值）可以看出，这些UV值直接反映了你 Shape 定义中的坐标值，例如 (-1500, 3000)、(-3000, 2000) 等。这意味着UV坐标的范围不是0到1，而是延伸到数千的单位。

### 为什么 texture.repeat 需要设置得很小？

- 纹理贴图本身通常被设计为在UV坐标从0到1的范围内完整显示一次。

- 在 side-wall.js 中，由于 ExtrudeGeometry 生成的UV坐标范围非常大（例如，U方向可能从-3000到0，跨度为3000个单位），如果 texture.repeat.x 设置为1，那么整个纹理图像会被极度拉伸以覆盖这3000个单位的UV空间。结果就是你几乎看不到纹理的图案，只能看到被不成比例放大的纹理的某个小部分，或者是一片模糊的颜色。

- **通过将 texture.repeat.x 和 texture.repeat.y 设置为一个很小的值，比如 0.0005，你实际上是在告诉Three.js：“我的纹理在UV坐标每增加1个单位时，应该重复 1 / 0.0005 = 2000 次。”**

- 换句话说，纹理的一个完整图案现在对应的不是1个UV单位的跨度，而是 1 / 0.0005 = 2000 个UV单位的跨度。

- 所以，如果你的墙面在U方向的UV坐标范围是3000个单位（例如从-3000到0），那么纹理图案将会在这个墙面上重复 3000 * 0.0005 = 1.5 次。这样，纹理图案就能以一个合理的大小显示出来，而不是被过度拉伸。

### 总结

- behind-wall.js 使用 **BoxGeometry**，**UV坐标自动生成且通常在 [0,1] 范围内**，texture.repeat 控制在这个标准化空间内的重复次数。

- side-wall.js 使用 **ExtrudeGeometry**，**UV坐标基于原始2D形状的顶点坐标**，导致UV范围很大（例如几千）。为了在这样大的UV范围上显示可见的、重复的纹理图案，需要将 texture.repeat 设置得很小，以“缩小”纹理在UV空间中的覆盖单位，从而在几何体表面实现多次重复。

简单来说，texture.repeat 的值与UV坐标的“单位尺寸”成反比。UV坐标范围越大，为了保持纹理图案的视觉大小，texture.repeat 就需要越小。



### 解决贴图重合闪烁

index.js

```js
const renderer=new THREE.WebGLRenderer({
  // 开启深度缓冲区，用来解决深度冲突
  logarithmicDepthBuffer:true
})
```





# 屋顶

因为屋顶的位置、宽度、旋转角度比较难计算，所以直接采用GUI调试出一个可靠的值。

```js
import * as THREE from 'three';
// 从 Three.js 的附加库中引入轻量级 GUI 控制面板
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// —— 1. 创建一个 BoxGeometry（长方体几何体）
// 参数依次是：宽度（X 轴尺寸）4200，
//             高度（Y 轴尺寸）2000，
//             深度（Z 轴尺寸）100
const geometry = new THREE.BoxGeometry(4200, 2000, 100);

// —— 2. 创建一个支持光照的 Lambert 漫反射材质，颜色设为红色
const material = new THREE.MeshLambertMaterial({
  color: new THREE.Color('red')
});

// —— 3. 用几何体和材质创建一个可渲染的网格对象 roof
const roof = new THREE.Mesh(geometry, material);

// —— 4. 定义一个普通对象 obj，用来存放通过 GUI 面板控制的参数
//    rotateX：绕 X 轴的旋转角度（弧度）
//    width：长方体的“高度”参数（将用于重新生成几何体）
const obj = {
  rotateX: 0,
  width: 2000
};

// —— 5. 创建 GUI 面板实例，默认会插入到页面右上角
const gui = new GUI();

// —— 6. 添加对 roof.position.y 的控制
//    滑条范围：-10000 到 10000，步长 100
//    用于在场景中上下移动模型
gui.add(roof.position, 'y')
   .min(-10000).max(10000).step(100);

// —— 7. 添加对 roof.position.z 的控制
//    滑条范围同上，用于前后平移模型
gui.add(roof.position, 'z')
   .min(-10000).max(10000).step(100);

// —— 8. 添加对材质 color 的颜色选择器
//    实时改变 roof 的颜色
gui.addColor(roof.material, 'color');

// —— 9. 添加对 obj.rotateX 的控制
//    滑条范围：0 到 2π（全旋转），步长 0.01 弧度
//    onChange 回调里，将新的角度赋给 roof.rotation.x
gui.add(obj, 'rotateX')
   .min(0).max(Math.PI * 2).step(0.01)
   .onChange(value => {
     // value 已经是弧度，无需再转换
     roof.rotation.x = value;
   });

// —— 10. 添加对 obj.width 的控制
//    用于动态调整几何体的“高度”
//    滑条范围：0 到 5000，步长 10
//    onChange 回调里，重新生成一个新的 BoxGeometry
gui.add(obj, 'width')
   .min(0).max(5000).step(10)
   .onChange(value => {
     // 注意：保持 X 和 Z 尺寸不变，更新 Y 尺寸为 value
     roof.geometry = new THREE.BoxGeometry(4200, value, 100);
   });

// —— 11. 导出生成的 roof 对象，供其他模块添加到场景中
export default roof;

```

## GUI 面板详解

```js
const gui = new GUI();
```

- 创建一个默认的 GUI 面板（通常会出现在网页的右上角），用于挂载各种可交互的控件。

### 1. 控制位置

```js
gui.add(roof.position, 'y').min(-10000).max(10000).step(100);
gui.add(roof.position, 'z').min(-10000).max(10000).step(100);
```

- **`add(obj, prop)`**：在面板里创建一个滑条，绑定到 `obj[prop]`。
- 这里分别为 `roof.position.y` 和 `roof.position.z` 创建滑条，可以在 –10000 到 10000 范围内，以 100 为步进，实时调整物体在场景中上下（Y 轴）和前后（Z 轴）的位置。

### 2. 控制颜色

```js
gui.addColor(roof.material, 'color');
```

- **`addColor(obj, prop)`**：专门用来创建颜色选择器，绑定到材质的 `color` 属性。
- 你可以点击色板，马上看到 `roof` 变成你选的任意颜色。

### 3. 控制旋转

```js
gui.add(obj, 'rotateX').min(0).max(Math.PI * 2).step(0.01)
   .onChange(value => {
     roof.rotation.x = value; 
   });
```

- 创建一个滑条，控制 `obj.rotateX` 在 0 到 2π（弧度制）之间变化，步进 0.01。
- **`.onChange`**：当滑条值改变时，执行回调，把 `roof.rotation.x`（绕本地 X 轴旋转角度）设为滑条的新值。这样就能实时俯仰或抬头低头。

### 4. 控制尺寸

```js
gui.add(obj, 'width').min(0).max(5000).step(10)
   .onChange(value => {
     roof.geometry = new THREE.BoxGeometry(4200, value, 100);
   });
```

- 绑定 `obj.width`（本例代表 BoxGeometry 的 Y 维度）制作滑条，可以从 0 控制到 5000，步进 10。
- 当值变化时，用新的高度 `value` 重建一个 `BoxGeometry`，并赋给 `roof.geometry`，实现“动态拉伸”长方体高度的效果。

## GUI 的用途和原理

1. **为什么要用 GUI**
   - 在开发或演示 Three.js 场景时，常常需要不断试验不同参数（位置、旋转、尺寸、材质颜色等）。传统写死在代码里，修改麻烦且需要刷新页面。
   - GUI 面板则提供交互式控制，一边拖动、一边看效果，大大加速调参和调试效率。
2. **GUI 的工作原理**
   - `lil-gui`（或早期的 `dat.GUI`）会根据 `add` 或 `addColor` 的调用，扫描你绑定的对象属性，自动在右侧浮层里生成对应的控件（滑条、输入框、色板等）。
   - 它内部通过 `Object.defineProperty` 或 Proxy 监听属性变化，或在滑条的 `onChange` 回调里把新值写回原对象，从而驱动你场景里对应的 Three.js 对象实时更新。

------

### 小结

- 这段代码用 Three.js 创建了一个红色长方体 `roof`，并用 `lil-gui` 快速搭建了一个可视化参数面板。
- 通过 GUI，你可以动态修改网格的位置、颜色、旋转和尺寸，无需手动改代码并刷新，大大提升了开发调试的效率和灵活性。



## 复制翻转屋顶

`roof2.rotateX = 70/180*Math.PI` 中的 **70°** 是为了让第二块屋顶板与水平面保持所需的倾斜角（即屋顶的“坡度”），这个角度一般由建筑的几何尺寸（檐口高度与椎顶高度差、房屋宽度等）或设计图纸决定，也可以通过在编辑器里可视化调节后读出。

`roof2.position.z = - roof.position.z` 则是将第二块屋顶相对于原屋顶在 Z 轴上做 **镜像对称** 放置，从而两块斜面正好形成左右对称的双坡屋顶。

### 1. 为什么要将屋顶旋转 70°

#### 1.1 屋顶板初始方向

当你 `import roof from './roof.js'` 时，`roof` 这块几何体本身是一个水平放置的长方体（BoxGeometry）。为了模拟双坡屋顶，你需要把它绕 X 轴旋转一个倾斜角度，使其一边抬高，一边降低。

#### 1.2 倾斜角度如何测算

倾斜角度（也叫“屋顶坡度”）通常由以下几种方式确定：

1. **从建筑几何尺寸计算**

   - 假设房屋宽度（两坡檐口之间的水平距离）为 `W`，屋脊（坡顶）比檐口高出的高度为 `H`，则坡面相对于水平面的夹角 α 应为：

     `α=arctan⁡(HW/2)  \alpha = \arctan\bigl(\tfrac{H}{W/2}\bigr)α=arctan(W/2H)`

   - 如果房屋宽度是 4200，屋脊高差大约 2800，那么
      `α=arctan⁡(2800/2100)≈53.7°\alpha = \arctan(2800 / 2100) \approx 53.7°α=arctan(2800/2100)≈53.7°。`

   - 如果你的设计图上坡度给定为 70°，那就直接用 70。

2. **从设计图或建筑规范读取**

   - 建筑图纸上经常会标注屋顶的坡度，比如 “7:12” 或 “30°” 等。你可以直接将这个角度带入代码。

3. **可视化调节后获取**

   - 在编辑器（比如 CodePen、VSCode + live server）中加入一个 GUI 或输入框，拖动滑条让屋顶在画面中看起来「正好」，然后在控制台打印当前角度，取整（如 70°）后写入代码。

```js
// 弧度 = 角度 × Math.PI / 180
roof2.rotation.x = 70 / 180 * Math.PI;
```

这里的 70° 就是上述过程里，项目所需的屋顶倾斜角度。

------

### 2. 为什么要镜像放置：`roof2.position.z = -roof.position.z`

- **`roof.position.z`** 表示第一块（原始）屋顶相对于其父物体（house 组）在 Z 轴上的偏移。
- 要把第二块屋顶放到另一侧，需要在 Z 轴上取相反数，才能实现左右对称。

```js
// 假设 roof.position.z = +2000，表示第一块屋顶在 +Z 方向偏移 2000。
// 则第二块要放到 -Z 方向相同距离，用 -2000：
roof2.position.z = - roof.position.z;
```

这样，两块同样倾斜的屋顶板，就能围合出一个标准的双坡屋顶。

------

### 3. 代码示例结合

```js
// 复制一个屋顶
const roof2 = roof.clone();

// 1) 先倾斜 70°（转为弧度）
//    让它成为另一侧的斜面
roof2.rotation.x = 70 / 180 * Math.PI;

// 2) 在 Z 轴上做镜像对称放置
roof2.position.z = - roof.position.z;

// 加入场景组
house.add(roof2);
```

- **rotation.x**：控制绕本地 X 轴倾斜的角度（弧度制）。
- **position.z**：将副本放到与原屋顶相对的 Z 轴另一侧，保证两面完全对称。





# 台阶绘制

## 概览

这段代码通过 `THREE.Shape` 定义了一个类似台阶的二维轮廓，然后用 `THREE.ExtrudeGeometry` 将其沿 Z 轴拉伸成三维模型。最后，将该模型绕 Y 轴旋转并移动到场景的合适位置。关键在于：`moveTo(x, y)` 标记起始点，后续每条 `lineTo(x, y)` 都会从上一个点绘制一条直线到新坐标，依次串联出所需多边形。[threejs.org](https://threejs.org/docs/api/en/extras/core/Shape.html?utm_source=chatgpt.com)。

```js
import * as THREE from 'three';

// —— 1. 定义一个二维 Shape，用于绘制台阶轮廓
const shape = new THREE.Shape();

// 从 (0,0) 开始，绘制第一步台阶的底边
shape.moveTo(0, 0);               // 起点：第一个点 :contentReference[oaicite:1]{index=1}

// 绘制第一块台阶的前沿，水平向右 200 单位
shape.lineTo(200, 0);             // 直线到 (200, 0) :contentReference[oaicite:2]{index=2}

// 向下 100 单位，形成第一块台阶的高度
shape.lineTo(200, -100);          // 直线到 (200, -100) :contentReference[oaicite:3]{index=3}

// 再向右 200，连接到第二块台阶的前沿
shape.lineTo(400, -100);          // 直线到 (400, -100) :contentReference[oaicite:4]{index=4}

// 向下 100，第二块台阶高度
shape.lineTo(400, -200);          // 直线到 (400, -200) :contentReference[oaicite:5]{index=5}

// 向右 200，第三块台阶前沿
shape.lineTo(600, -200);          // 直线到 (600, -200) :contentReference[oaicite:6]{index=6}

// 向下 100，最后收尾
shape.lineTo(600, -300);          // 直线到 (600, -300) :contentReference[oaicite:7]{index=7}

// 回到起点的同一水平线，以形成闭合路径
shape.lineTo(0, -300);            // 直线到 (0, -300) :contentReference[oaicite:8]{index=8}

// —— 2. 将二维轮廓挤出为三维几何体
const geometry = new THREE.ExtrudeGeometry(shape, {
  depth: 1000  // 沿本地 Z 轴挤出 1000 单位 :contentReference[oaicite:9]{index=9}
});

// —— 3. 创建材质和网格对象
const material = new THREE.MeshLambertMaterial({
  color: new THREE.Color('grey')  // 漫反射材质，灰色 :contentReference[oaicite:10]{index=10}
});
const doorstep = new THREE.Mesh(geometry, material);

// —— 4. 调整朝向与位置
doorstep.rotateY(-Math.PI / 2);    // 绕 Y 轴逆时针 90° :contentReference[oaicite:11]{index=11}
doorstep.position.z = 1500;        // 沿世界 Z 轴移动 1500 :contentReference[oaicite:12]{index=12}
doorstep.position.y = 150;         // 提升到 y=150 的高度 :contentReference[oaicite:13]{index=13}

// —— 5. 导出以供场景中使用
export default doorstep;

```



## 台阶是如何绘制的？

1. **本地二维坐标系**
    `THREE.Shape` 内部维护一个二位点阵（XY 平面）[threejs.org](https://threejs.org/docs/api/en/extras/core/Shape.html?utm_source=chatgpt.com)。调用 `moveTo(x,y)` 时，画笔（当前“笔迹”位置）跳到 `(x,y)`；后续每次 `lineTo(x,y)`，Shape 就在当前笔迹和新坐标间绘制一条直线，并将笔迹更新到新坐标[threejs.org](https://threejs.org/docs/?utm_source=chatgpt.com)。
2. **依次串联出折线**
   - 从 `(0,0)` 向右到 `(200,0)`，绘制第一阶的前缘。
   - 然后向下到 `(200,-100)`，形成第一阶高度。
   - 再向右到 `(400,-100)`，开始第二阶，依此类推，直到最后一个点 `(0,-300)`，完成最下阶的平台。
3. **闭合与挤出**
   - 虽然示例中并未显式调用 `shape.closePath()`，最后一条 `lineTo(0, -300)` 已经回到左边，使路径在几何算法中被视为闭合[Dustin John Pfister at github pages](https://dustinpfister.github.io/2021/06/01/threejs-shape/?utm_source=chatgpt.com)。
   - `ExtrudeGeometry` 会根据该闭合轮廓生成面，并沿 Z 轴添加侧面和底面，形成三维台阶模型[threejs.org](https://threejs.org/docs/api/en/geometries/ExtrudeGeometry.html?utm_source=chatgpt.com)。
4. **与直观坐标的差异**
    许多人习惯于在平面画布上把 `(x,y)` 理解为“相对于屏幕左上角”或“以像素为单位”，但在 Three.js 的 `Shape` 中，所有坐标都在一个自定义的局部平面内，原点和方向由你调用 `moveTo`/`lineTo` 的首个点和模型的姿态决定，**与场景的世界坐标系并不直接对应**，直到挤出并放入场景后才会统一投影渲染[threejs.org](https://threejs.org/docs/api/en/extras/core/Shape.html?utm_source=chatgpt.com)。

1. **从 (0,0) 到 (200,0)**
    第一条水平线，形成第一级台阶的最前面（台阶的踏面最外侧）。
2. **从 (200,0) 到 (200,−100)**
    向下绘制第一阶的阶高 100。
3. **从 (200,−100) 到 (400,−100)**
    再向右画 200，实际上就是在第一阶下方继续画第二阶的踏面最前沿。想象你从第一级台阶走下去，到达第二级台阶的最前方，正是这个水平距离。

如果改为“往回画到 (0,−100)”，那就会把轮廓变成一个倒退的形状，完全不是台阶的层叠效果，而是把路径拉成一个“∩”字型，画不出阶梯。

正确的台阶断面是向右→向下→再向右→再向下……，这样才能一层层地往前、往下形成阶梯：

```
scss复制编辑(0,0) ──▶ (200,0)
            │
            ▼
          (200,−100) ──▶ (400,−100)
                            │
                            ▼
                         (400,−200) ──▶ …
```

每一次 `lineTo(x, y)`，都是从上一个点 **延续** 一条直线到新的坐标。这种“先右后下，再右再下”的折线，正好勾勒出了楼梯的台阶断面。

**最后再拉长depth，就生成了一个楼梯阶梯了。**

##  Canvas / SVG 路径的自动闭合行为

- 在 HTML Canvas 里，如果你使用 `fill()`（或在 Three.js 用 Shape 填充/挤出），浏览器会**自动将路径的最后一个点与起点相连**来闭合区域，并据此生成面片，无需显式调用 `closePath()` [Reddit](https://www.reddit.com/r/learnjavascript/comments/dd6a02/in_canvas_when_is_it_okay_to_omit_beginpath_and/?utm_source=chatgpt.com)。
- 同样在 SVG 中，使用 `<path>` 元素并填充（`fill="...“`）时，如果路径数据没有以 `Z` / `z`（close path 命令）结尾，渲染器也会在填充阶段自动闭合 [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/closePath?utm_source=chatgpt.com)。

------

##  Three.js 中 Shape → ExtrudeGeometry 的闭合逻辑

- `THREE.Shape` 本质上是 Canvas/SVG 路径的抽象。当你调用多次 `moveTo`/`lineTo`，Three.js 在内部记录了一系列顶点。
- 当传入 `new THREE.ExtrudeGeometry(shape, …)` 时，Three.js 会在“挤出”前对这个 2D 轮廓做**三角剖分**。在剖分算法里，主轮廓会被当作已闭合的环（ring），算法自动把最后一个点和第一个点连起来，形成一个完整的多边形面片 [Stack Overflow](https://stackoverflow.com/questions/52791914/shapepath-auto-closing?utm_source=chatgpt.com)。
- 因此，最后那条“回到 (0,0)”的线段是不必要的——不写它，Shape 依旧会被当作闭合路径来挤出三维几何。

------

### → 小结

- **不写 `shape.lineTo(0, 0)`**：挤出时 Shape 一定会闭合，不会漏面。
- **何时用 `closePath()` / `Z` 命令**：仅在需要手动控制路径闭合、或在 Canvas 中用 `stroke()` 而非 `fill()` 时才必需；Three.js 的填充与挤出流程会自动闭环。





# 相机自动旋转视角

```js
// 相机旋转视角
let angle = 0;     // 记录当前角度，用来算出相机的位置
let radius = 5000; // 圆圈的半径，也就是相机离场景中心的距离

function render() {
  // 1. 每次渲染前，让角度往前走一点
  angle += 0.03;   // 以 0.03 弧度增量为例，大约每帧转 1.7°（0.03 × 180/π ≈ 1.72°）

  // 2. 计算新的相机位置：在水平面（XZ 平面）上绕原点做圆周运动
  //   x = 半径 × cos(当前角度)
  camera.position.x = radius * Math.cos(angle);
  //   z = 半径 × sin(当前角度)
  camera.position.z = radius * Math.sin(angle);
  //   y 保持不变（如果想上下也动，可以同样用 sin/cos）

  // 3. 每次都让相机“看”向场景中心 (0,0,0)
  camera.lookAt(0, 0, 0);

  // 4. 渲染这一帧
  renderer.render(scene, camera);

  // 5. 请求下一帧，循环调用自己，实现动画
  requestAnimationFrame(render);
}
```

## 数学原理（极坐标转直角坐标）

1. **角度 (angle)**

   - 我们用一个变量 `angle` 来表示“当前走到圆圈哪个位置”，它的单位是 **弧度**（rad）。
   - 弧度和角度的换算：1 圈 = 360° = 2π rad；
      所以 1 rad ≈ 57.3°，增加 0.03 rad ≈ 1.7°。

2. **半径 (radius)**

   - 圆圈的半径 `radius` 决定相机到场景中心的固定距离，越大相机绕得越远、视野越宽。

3. **cos 和 sin 的作用**

   - 在数学里，圆上的任意一点都可用极坐标 (r, θ) 表示：r 是半径，θ 是角度。

   - 把极坐标转换到坐标系里的公式是：

     ```ini
     x = r * cos(θ)
     z = r * sin(θ)
     ```

   - 这样，当 θ 从 0→2π 时，(x, z) 就会在以原点为中心、半径为 r 的圆上走一圈。

![image-20250520173015660](D:\HeinrichHu\resource\新建文件夹\threeJS\09_house\README.assets\image-20250520173015660.png)

------

上图展示了极坐标 `(r,θ)` 到直角坐标 `(x,z)` 的转换示意：

- **圆**：灰色圆形表示所有满足 `x²+z²=r²` 的点。
- **径向线**：从原点 `(0,0)` 到红色圆周点 `(x,z)` 的线段，长度为半径 `r`。
- **投影**：
  - 水平投影到 X 轴（蓝线），对应长度 `x = r * cos(θ)`；
  - 垂直投影到 Z 轴（绿线），对应长度 `z = r * sin(θ)`。

由图可见，当角度 `θ`（从 X 轴正方向逆时针量起）变化时，

- `cos(θ)` 给出该点在 X 方向上相对于半径的比例；
- `sin(θ)` 给出该点在 Z 方向的比例。

因此只要知道 `r` 和 `θ`，就可以通过下面两条公式，算出点在三维场景 XZ 平面上的坐标：

```INI
x = r * cos(θ)  
z = r * sin(θ)  

```



## 为什么这样写能让相机绕场景转

- **逐帧更新**：把角度 `angle` 每次都加一点，在下一帧用新的角度算位置；
- **不断渲染**：每次计算新位置后渲染画面，再请求下一帧，动画才连贯；
- **对准目标**：每帧都调用 `camera.lookAt(0,0,0)`，保证相机始终朝向场景中心，不管它在哪个位置。

这样，观众就能看到模型或场景像被“围观”一样，从四面八方转一圈，效果直观又好看。