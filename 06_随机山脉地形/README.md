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



在3D图形中，面的渲染通常是基于顶点的绕序(winding order)来决定正面和背面的：

- 逆时针顶点序列通常定义为正面(front face)

- 顺时针顶点序列通常定义为背面(back face)

在您的代码中，可以同时看到平面的正反两面是因为您设置了wireframe: true属性。当使用线框模式时，Three.js会渲染所有的边，而不管它们是正面还是背面，所以您可以看到整个网格结构。