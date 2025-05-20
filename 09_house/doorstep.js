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
const loader=new THREE.TextureLoader();
const texture=loader.load('./assets/diji.png')
texture.colorSpace=THREE.SRGBColorSpace;
texture.wrapS=THREE.RepeatWrapping;
texture.wrapT=THREE.RepeatWrapping;
texture.repeat.x=0.001;
texture.repeat.y=0.001;
// —— 3. 创建材质和网格对象
const material = new THREE.MeshLambertMaterial({
  // color: new THREE.Color('grey')  // 漫反射材质，灰色 :contentReference[oaicite:10]{index=10}
  map:texture,
  aoMap:texture
});
const doorstep = new THREE.Mesh(geometry, material);

// —— 4. 调整朝向与位置
doorstep.rotateY(-Math.PI / 2);    // 绕 Y 轴逆时针 90° :contentReference[oaicite:11]{index=11}
doorstep.position.z = 1500;        // 沿世界 Z 轴移动 1500 :contentReference[oaicite:12]{index=12}
doorstep.position.y = 150;         // 提升到 y=150 的高度 :contentReference[oaicite:13]{index=13}

// —— 5. 导出以供场景中使用
export default doorstep;
