# Three.js 光源类型详解

本文档结合代码示例，讲解 Three.js 中的点光源 (PointLight)、平行光 (DirectionalLight) 和聚光灯 (SpotLight) 的原理和展示效果。

## 1. 平行光 (DirectionalLight)

平行光是模拟远处光源（如太阳光）发出的光线，这些光线可以被认为是相互平行的。平行光照射到物体表面时，光照强度不随距离的增加而衰减。

**原理：**
平行光由一个方向向量唯一定义，场景中所有平行的光线都沿着这个方向。它的位置属性 (`position`) 通常用来定义光线的方向（从光源位置指向场景原点或 `target` 对象）。

**在 `mesh.js` 文件中的应用：**

- **创建平行光：**
  
  ```javascript
  // 添加平行光
  export const light = new THREE.DirectionalLight(0xffffff, 1); // 白色光，强度为 1
  ```
- **设置光源位置（影响方向）：**
  ```javascript
  light.position.set(400, 500, 300); // 光源位置，决定了光线的方向
  light.lookAt(0, 0, 0); // 光线射向原点 (对于 DirectionalLight，lookAt 和 target 会影响光照方向的计算)
  ```
  平行光从 (400, 500, 300) 位置射向 (0,0,0) 点。
- **可视化辅助对象：**
  ```javascript
  const helper = new THREE.DirectionalLightHelper(light, 100); // 尺寸为 100 的辅助平面
  mesh.add(helper);
  ```
  `DirectionalLightHelper` 会显示一个平面和一条线来代表光线的方向。
- **GUI 调试：**
  代码中使用 `lil-gui` 调整平行光的 `position`（进而调整方向）和 `intensity`（光照强度），可以直观地看到不同参数对场景光照效果的影响。

**展示效果：**
场景中的物体会被来自特定方向的平行光线照亮，形成清晰的明暗对比。由于光强不衰减，远近物体接收到的光照强度相同。如果启用了阴影，阴影是平行的。



**平行光（DirectionalLight）在照射到物体时，其光照强度本身不会因为物体距离光源的远近而衰减。**

打个比方，太阳光就是一种典型的平行光。无论一个物体离太阳的“虚拟位置”（在Three.js中用 light.position 来定义方向）是近还是远，只要它在光线路径上并且没有被遮挡，它接收到的初始光照强度是相同的。

但是，有几个重要的点需要注意，这会影响最终物体表面的亮度：

1. 表面法线与光线方向的角度：

- 一个物体的表面最终看起来有多亮，还取决于该表面与光线方向的夹角。

- 如果一个表面正对着光线（表面法线与光线方向相反），它会显得最亮。

- 如果表面与光线平行，那么它几乎不会被照亮。

- 这就是为什么同一个立方体，不同的面亮度会不一样。

2. 阴影：

- 如果一个物体被另一个物体挡住了，那么它就处于阴影中，不会接收到平行光的直接照射。

3. 材质属性：

- 物体的材质（例如 MeshLambertMaterial, MeshPhongMaterial 等）如何响应光照也会影响最终的视觉效果。不同的材质对光的反射和散射方式不同。

总结一下：

- 核心特点：平行光的光线是平行的，其强度不随距离衰减。这意味着所有直接暴露在光线下、且朝向相同的表面，无论远近，接收到的光照强度是一致的。

- 视觉效果：物体表面各部分的亮度会因其相对于光线的朝向而变化。正对光源的面最亮，斜对的次之，背对或平行于光线的面最暗（或仅受环境光影响）。

所以，说“100%均匀地照射”是指光线本身的强度在传播过程中是均匀的，不会衰减。但具体到物体表面的明暗程度，则会受到表面朝向和遮挡关系的影响。

## 2. 点光源 (PointLight)

点光源从空间中的一个点向所有方向发射光线，类似于一个普通的灯泡。光照强度会随着距离的增加而衰减。

**原理：**
点光源由其在场景中的位置 (`position`) 定义。光线从这个点向四面八方辐射。其光照强度受 `intensity` (光照强度)、`distance` (光照有效最大距离，0表示无限远) 和 `decay` (光照强度随距离的衰减速率，物理上通常为2) 参数影响。

**在 `mesh2.js` 文件中的应用：**

- **创建点光源：**
  ```javascript
  // 添加点光源
  export const light = new THREE.PointLight(0xffffff, 1000000); 
  // 白色光，强度值。注意：Three.js r155+ 强度单位变为物理单位(坎德拉)，此处的1000000可能非常亮。
  // 若效果过强，可减小此值，或参考官方文档设置 power (流明)。
  ```
- **设置光源位置：**
  ```javascript
  light.position.set(400, 500, 300); // 点光源的位置
  // light.lookAt(0,0,0) // PointLight 向所有方向发光，通常不需要 lookAt
  ```
- **环境光：**
  ```javascript
  const ambientLight = new THREE.AmbientLight(0xffffff); // 添加环境光，颜色为白色
  mesh.add(ambientLight);
  ```
  为了保证物体的背光面也能被看到，而不是完全黑色，通常会添加一个环境光。
- **可视化辅助对象：**
  ```javascript
  const helper = new THREE.PointLightHelper(light, 100); // 辅助对象代表光源位置，大小为 100
  mesh.add(helper);
  ```
  `PointLightHelper` 显示一个小球体代表光源位置。
- **GUI 调试：**
  代码中使用 `lil-gui` 调整点光源的 `position` 和 `intensity`，可以观察其对场景光照范围和亮度的影响。

**展示效果：**
物体表面会根据其与点光源的距离和角度呈现不同的亮度。离光源越近，物体越亮。光线向所有方向散射，形成向四周扩散的照明效果。



**点光源 (PointLight) 的核心特性就是从一个点向所有方向均匀发射光线**，所以：

1. 不需要特意设置角度：与聚光灯 (SpotLight) 不同，点光源没有像 angle（张角）这样的属性来限制光线的照射范围和方向。它天生就是向四面八方照射的。虽然 PointLight 对象也继承了 lookAt 方法，但对于点光源来说，这个方法通常没有实际意义，因为无论它朝向哪里，光线都会向所有方向发出。

1. 光线传播效果（衍射/衰减）：

- 强度 (intensity)：这是最直接影响光线亮度的参数。

- 位置 (position)：决定了光线的发射点。

- 距离 (distance)：这个属性定义了光线能够照射到的最大距离。如果 distance 为0（默认值），光线可以照射到无限远（理论上）。如果设置一个大于0的值，光照强度会从光源处开始，到这个指定的 distance 处衰减为0。在您的 mesh2.js 文件中，GUI部分有被注释掉的 distance 控制器，您可以取消注释来试验这个效果。

- 衰减 (decay)：这个属性控制光照强度随距离增加而减弱的速率。物理上更准确的衰减值为2。默认值也是2。同样，在您的 mesh2.js 文件中，也有被注释掉的 decay 控制器。

所以，点光源的“衍射效果”或更准确地说是光照范围和衰减方式，主要是由它的 position、intensity、distance 和 decay 这几个属性共同决定的。您不需要像聚光灯那样去设定一个特定的光锥角度。

## 3. 聚光灯 (SpotLight)

聚光灯从一个点沿一个方向发射圆锥形光束，类似于手电筒或舞台上的聚光灯。光照强度会随距离衰减，并且光束有明确的边界。

**原理：**
聚光灯由其位置 (`position`)、目标方向 (通过 `target` 对象或 `lookAt` 方法设置)、光束张角 (`angle`)、半影衰减 (`penumbra`，光束边缘的柔和度) 和光照距离 (`distance`) 共同定义。

**在 `mesh3.js` 文件中的应用：**

- **创建聚光灯：**
  ```javascript
  // 添加聚光灯
  export const light = new THREE.SpotLight(0xffffff, 1000000); // 白色光，强度值 (同样注意单位变化)
  ```
- **设置聚光灯参数：**
  ```javascript
  light.distance = 1000;        // 光照最大距离
  light.angle = Math.PI / 6;   // 光束张角 (30度)
  light.position.set(400, 500, 300); // 光源位置
  light.lookAt(0, 0, 0);       // 光源照射方向，指向原点
  ```
- **可视化辅助对象：**
  ```javascript
  const helper = new THREE.SpotLightHelper(light);
  mesh.add(helper);
  ```
  `SpotLightHelper` 会显示一个代表聚光灯光锥的辅助几何体。
- **GUI 调试与辅助对象更新：**
  ```javascript
  const f1 = gui.addFolder('聚光灯');
  function onChange() {
    helper.update(); // 当聚光灯参数改变时，需要手动更新 helper
  }
  f1.add(light.position, 'x').min(10).max(1000).onChange(onChange);
  // ... 其他参数 (y, z, angle, intensity, distance) 的GUI控制
  ```
  当通过 GUI 修改聚光灯的参数 (如位置、角度、距离) 时，会调用 `onChange` 函数来更新 `SpotLightHelper` 的显示，使其与聚光灯的实际状态保持一致。

**展示效果：**
场景中会形成一个圆锥形的光照区域。光锥中心最亮，边缘逐渐变暗（如果 `penumbra` > 0，边缘会更柔和）。光照强度随距离衰减。只有在光锥内的物体才会被照亮。

---

**总结：**

- **平行光 (`DirectionalLight`)**: 模拟太阳等远距离光源，光线平行，强度不衰减（或衰减极慢），主要由方向决定。
- **点光源 (`PointLight`)**: 模拟灯泡等，从一点向所有方向发光，强度随距离衰减。
- **聚光灯 (`SpotLight`)**: 模拟手电筒、舞台灯，从一点向一个锥形区域发光，强度随距离衰减，有明确光照范围和方向。

选择哪种光源取决于你希望在场景中实现的光照效果。通常，一个复杂的场景可能会组合使用多种光源，并配合环境光来达到更真实或艺术化的效果。



## 4. 半球光 (HemisphereLight)

半球光 (`HemisphereLight`) 模拟了来自天空的环境光和来自地面反射的环境光。它不会产生阴影，主要用于提供整体的基础照明，使场景看起来更自然，避免物体背光面完全变黑。

**原理：**
半球光从两个方向发出光线：一个是从天空的颜色 (`skyColor`)，另一个是从地面的颜色 (`groundColor`)。物体表面的颜色会根据其法线方向在这两种颜色之间进行混合。光线的方向（即哪个方向是“天空”，哪个方向是“地面”）是由光源的 `position` 属性和 `up` 向量（通常通过 `lookAt` 或默认朝向确定）决定的。简单来说，光从天空方向（通常是光源的局部正Y轴）照射下来，从地面方向（光源的局部负Y轴）反射上来。

**在 `mesh4.js` 文件中的应用：**

- **创建半球光：**
  ```javascript
  export const light = new THREE.HemisphereLight(
    new THREE.Color('orange'), // skyColor - 天空光的颜色
    new THREE.Color('green'),  // groundColor - 地面光的颜色
    1                          // intensity - 光照强度
  );
  ```
- **设置光源位置（影响光照方向）：**
  ```javascript
  light.position.set(400, 500, 300);
  // light.lookAt(0, 0, 0); // 默认目标是原点
  ```
  光源的位置定义了天空光线的来源方向。从 `light.position` 指向场景原点 (0,0,0) 的方向被认为是天空的主要方向。

- **可视化辅助对象：**
  ```javascript
  const helper = new THREE.HemisphereLightHelper(light, 100); // 100 是辅助对象的大小
  mesh.add(helper);
  ```
  `HemisphereLightHelper` 显示一个代表光源方向和颜色分布的辅助对象。

- **GUI 调试：**
  代码中使用 `lil-gui` 调整半球光的 `position`（进而调整光照方向）、`intensity`（光照强度）、`color`（天空光颜色）和 `groundColor`（地面光颜色），可以直观地看到不同参数对场景光照效果的影响。

**展示效果：**
场景中的物体会根据其表面朝向，从上方接收到 `skyColor` 的光照，从下方接收到 `groundColor` 的光照，中间部分则会是这两种颜色的平滑过渡。这为场景提供了一个柔和的、有色彩倾向的环境光。