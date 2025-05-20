import * as THREE from 'three';
const loader=new THREE.TextureLoader();
const texture=loader.load('./assets/zhuan.png')
texture.colorSpace=THREE.SRGBColorSpace;
texture.wrapS=THREE.RepeatWrapping;
texture.repeat.x=0.0005;
texture.repeat.y=0.0005;

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


// 创建窗户
const windowPath=new THREE.Path()
windowPath.moveTo(-600,400)
windowPath.lineTo(-600,1600)
windowPath.lineTo(-2400,1600)
windowPath.lineTo(-2400,400)

// 将窗户路径添加到形状的 holes 数组中
shape.holes.push(windowPath)

// 2. 将上述二维形状进行“挤出”操作，生成三维几何体（ExtrudeGeometry）
const geometry = new THREE.ExtrudeGeometry(shape, {
  depth: 100    // 指定挤出的深度为 100 个单位，沿 Z 轴方向
});

// 后续你可以用这个 geometry 创建网格（Mesh），并添加到场景中：
// const material = new THREE.MeshLambertMaterial({ color: 'lightgrey' });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);


const material=new THREE.MeshLambertMaterial({
  // color:new THREE.Color('lightGrey')
  map:texture,
  aoMap:texture
})

const sideWall=new THREE.Mesh(geometry,material)

export default sideWall