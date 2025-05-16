# data.gui的应用

```typescript
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

```

引用GUI对象，通过new生成的gui对象创建几个控件:
```js

const gui = new GUI()
gui.addColor(mesh.material, 'color')
gui.add(mesh.position, 'x').step(10)
gui.add(mesh.position, 'y').step(10)
gui.add(mesh.position, 'z').step(10)
```

gui是在浏览器调试mesh的工具，我们可以通过gui来定义具体调整mesh或者pointLight等等具体展示指标的值，然后在浏览器进行调整，调整到合适以后再把对应的值写入代码编辑器的代码之中。

## 区分不同的调试目标

我们可以通过gui.addFolder(目标名)创建不同的分组目标，然后对这个目标进行add的函数调用进行调试:
```ts
const gui = new GUI()
const meshFolder = gui.addFolder('立方体')
// 调整mesh物体
meshFolder.addColor(mesh.material, 'color')
meshFolder.add(mesh.position, 'x').step(10)
meshFolder.add(mesh.position, 'y').step(10)
meshFolder.add(mesh.position, 'z').step(10)



const pointLight = new THREE.PointLight(0xffffff, 10000)

pointLight.position.set(80, 80, 80)

scene.add(pointLight)

// 调整灯源
const lightFolder = gui.addFolder('灯源')
lightFolder.add(pointLight.position, 'x').step(10)
lightFolder.add(pointLight.position, 'y').step(10)
lightFolder.add(pointLight.position, 'z').step(10)
// 调整灯源强度
lightFolder.add(pointLight, 'intensity').step(1000)
```

![image-20250406000505304](/assets/image-20250406000505304.png)

我们也可以通过定义其他类型，过一下具体的一些配置:

```ts
const otherFolder = gui.addFolder('其他类型')
const obj = {
  aaa: '天王盖地虎',
  bbb: false,
  ccc: 0,
  ddd: '111',
  fff: 'Bbb',
  logic: function () {
    alert('执行一段逻辑!');
  }
};

otherFolder.add(obj, 'aaa')
otherFolder.add(obj, 'bbb')
otherFolder.add(obj, 'ccc').min(-10).max(10).step(0.5)
otherFolder.add(obj, 'ddd', ['111', '222', '333'])
otherFolder.add(obj, 'fff', { Aaa: 0, Bbb: 0.1, Ccc: 5 })
otherFolder.add(obj, 'logic')
```

![image-20250406001001716](/assets/image-20250406001001716.png)

对数值，可以使用min().max().step()设置选值范围条。

对对象，可以实现选择。
对函数，点击可以触发调用。

这些都是通过目标的add()函数来实现的,step()设置的都是add()生成对象下的默认值。



实际上，我们还可以利用`otherFolder.add().onChange((value)=>{console.log(value)})`这种调用方法来实现修改数值时候的触发:

```typescript
otherFolder.add(obj, 'aaa').onChange((value) => console.log(value))
```

