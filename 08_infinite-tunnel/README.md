# Three.js 无限通道效果解析

## 动画核心逻辑 (`src/main.js` 中的 `render` 函数)

该项目的核心动画效果主要在 `src/main.js` 文件的 `render` 函数中实现。其基本思路是通过操纵模型自身的属性（纹理偏移和旋转）来模拟相机在无限通道中穿梭和旋转的视觉效果，而不是直接移动相机。

### 1. 时间同步 - `THREE.Clock`

```javascript
const clock = new THREE.Clock();

function render() {
  const delta = clock.getDelta();
  // ... 动画更新代码 ...
}
```

*   **`const clock = new THREE.Clock();`**: 初始化一个 `THREE.Clock` 对象。这个对象用于跟踪自上一帧以来经过的时间。
*   **`const delta = clock.getDelta();`**: 在每一帧的开始，调用 `getDelta()` 方法获取时间差（单位：秒）。这个 `delta` 值确保了动画的播放速度与设备的帧率无关，使得在不同性能的设备上动画看起来速度一致。



**这一行代码创建了一个 THREE.Clock 的实例。Clock 是 Three.js 中一个辅助对象，主要用来跟踪时间。这对于创建平滑且与帧率无关的动画至关重要。**

在 render 函数内部，clock.getDelta() 方法被调用。这个方法会返回自上次调用 getDelta()以来所经过的时间（以秒为单位）。如果是第一次调用，则返回自 Clock 创建以来所经过的时间。

使用 delta（时间增量）可以确保动画的播放速度在不同刷新率的设备上保持一致。如果帧率高，delta 会比较小；如果帧率低，delta 会比较大，但乘以 delta 后，动画在单位真实时间内的变化量是恒定的。

### 2. 模拟前进 - 纹理UV动画

```javascript
// mesh 是场景中的主要通道模型
mesh.material.map.offset.y += delta * 0.5;
```

*   **`mesh.material.map`**: 指的是应用在通道模型 (`mesh`) 上的材质所使用的纹理贴图。
*   **`.offset.y`**: 这是纹理在垂直方向（V轴）上的偏移量。
*   通过在每一帧将 `offset.y` 增加一个由 `delta`（时间差）和速度因子（这里是 `0.5`）计算出来的值，纹理会在模型表面持续向上或向下滚动（取决于UV映射和纹理本身）。
*   **效果**: 这就制造出一种视觉错觉，好像相机正在沿着通道不断前进，而通道的表面纹理在向后流动。

### 3. 模拟旋转 - 模型自身旋转

```javascript
mesh.rotation.y += delta * 0.5;
```

*   **`mesh.rotation.y`**: 代表通道模型 (`mesh`) 绕其自身Y轴的旋转角度（以弧度为单位）。
*   每一帧都将这个旋转角度增加一个由 `delta` 和速度因子（`0.5`）计算出来的值。
*   **效果**: 这使得通道自身不断旋转，增加了场景的动态感和一种迷幻的隧道效果。

### 4. 渲染循环 - `requestAnimationFrame`

```javascript
function render() {
  // ... (更新纹理偏移和模型旋转) ...

  renderer.render(scene, camera); // 执行渲染
  requestAnimationFrame(render); // 请求下一帧继续调用 render 函数
}

render(); // 启动渲染循环
```

*   **`renderer.render(scene, camera);`**: 这是Three.js的标准渲染命令，它会根据相机 (`camera`) 的视角将场景 (`scene`) 绘制出来。
*   **`requestAnimationFrame(render);`**: 这是浏览器提供的API，用于优化动画。它会告诉浏览器在下一次屏幕刷新之前调用 `render` 函数。这样就形成了一个高效的动画循环，与显示器的刷新率同步，从而获得流畅的动画效果。当页面不处于激活状态时，动画会自动暂停，节省资源。

## 总结

通过结合使用 `THREE.Clock` 进行时间同步，利用纹理的 `offset` 属性实现UV动画来模拟前进感，以及直接修改模型的 `rotation` 属性来实现旋转效果，最后通过 `requestAnimationFrame` 构建高效的渲染循环，共同创造了这个无限通道的动态视觉体验。这种方法的巧妙之处在于，它避免了复杂或无限延伸的几何体构建，通过简单的材质和模型变换达到了预期的视觉效果。



# 贴图讲解

在 Three.js 的材质（Material）中，map 和 alphaMap 都是用来指定纹理的，但它们有不同的作用：

## map (颜色贴图 / 漫反射贴图)

- 这是最常用的纹理类型，它定义了物体表面的基本颜色和图案。

- 当你给 material.map 属性赋一个纹理时，这个纹理的颜色信息会被应用到模型的表面。

- 如果这个纹理图片本身带有 Alpha 通道（例如，一个带有透明背景的 PNG 图片），并且材质的 transparent属性设置为 true，那么纹理的 Alpha 通道也会影响物体的透明度。

## alphaMap (Alpha 贴图)

- alphaMap 是一个灰度纹理，专门用来控制材质表面的不透明度。它独立于 map 提供的颜色信息。

- 纹理中白色的部分表示完全不透明，黑色的部分表示完全透明，灰色的部分则表示半透明。材质的 transparent 属性必须设置为 true，alphaMap 才能生效。

- 即使 map 纹理本身也带有 Alpha 通道，如果同时设置了 alphaMap，则通常 alphaMap 会覆盖 map 纹理的 Alpha 信息，或者两者结合（具体行为可能取决于渲染管线和材质类型，但通常 alphaMap 提供了更直接的 Alpha 控制）。

在你提供的代码中：

```typescript
// src/mesh.js
const material = new THREE.MeshBasicMaterial({
    // color: 'orange', // 基础颜色被注释掉了，默认为白色
    transparent: true,     // 必须设置为 true，alphaMap 和透明效果才能生效
    alphaMap: texture,     // 使用 texture 作为 Alpha 贴图
    // map:texture,        // map 属性被注释掉了
    side: THREE.BackSide
});

// src/main.js
mesh.material.alphaMap.offset.y += delta * 0.5; // 动画滚动的是 alphaMap 的纹理偏移
```

为什么这里采用 alphaMap 而不是 map？

1. 分离颜色和透明度控制：

- texture 被赋给了 alphaMap，意味着这个 texture 的灰度值（亮度）被用来精确控制模型不同部分的不透明度。例如，如果 texture 是一张黑白条纹图片，那么模型表面在条纹白色区域会显示基础颜色（例如白色或橙色），在条纹黑色区域则会完全透明。

2. 独立的透明度动画：

- 在 main.js 中，`动画效果是 mesh.material.alphaMap.offset.y += delta * 0.5`。这表示你正在滚动 alphaMap 纹理在垂直方向上的偏移。

- **这样做可以实现一种动态的透明效果。例如，如果你的 alphaMap 纹理是一些孔洞或者渐变的图案，滚动它会使得这些透明的区域在模型表面移动，创造出类似光影扫过、能量流动或物体逐渐显现/消失的视觉效果。**

- 如果将 texture 同时用作 map 和 alphaMap（或者 texture 本身包含 Alpha 通道并用作 map），那么滚动 map.offset.y 会同时移动颜色图案和透明图案。通过将 alphaMap 分离出来，你可以让一个固定的基础颜色（或无色的，仅受光照影响的表面）拥有动态变化的透明区域。

1. 效果目的：

- **对于创建“无限通道”效果，使用 alphaMap 并对其进行动画，可以模拟通道壁上出现动态的开口、图案或能量效果。例如，通道壁可能是某种纯色，但通过滚动的 alphaMap，可以使某些部分周期性地变得透明，仿佛有光束穿过或壁面在溶解和重构。**

- 配合 side: THREE.BackSide，这通常意味着你是在一个模型的内部观察，比如在通道内部。alphaMap 产生的透明效果会让你能“看透”通道壁的某些部分。

总结：

- 如果你希望纹理既定义颜色又定义透明度（通过其自身的 Alpha 通道），并且颜色和透明度图案总是同步移动，那么可以将纹理赋给 map 并设置 transparent: true。

- 如果你希望使用一个独立的灰度图来精细控制一个（可能是纯色或由另一纹理定义的）表面的透明区域，并且可能需要独立于颜色图案来动画化这个透明图案，那么 alphaMap 是更好的选择。

在你当前的实现中，选择 alphaMap 使得你可以专注于创建一个滚动的、定义透明区域的动态“遮罩”效果，而这个遮罩是应用在一个默认颜色（白色）或指定颜色（如果取消注释的 orange）的表面上的。