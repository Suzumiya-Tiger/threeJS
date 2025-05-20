import * as THREE from 'three';

// 我们用 Group 来添加一组物体，首先用 BoxGeometry 创建了地基。
// 然后创建了漫反射材质，最后用 Mesh 将地基和材质结合在一起。
// 最后将地基添加到组中。


const loader=new THREE.TextureLoader();
const texture=loader.load('./assets/diji.png')
texture.colorSpace=THREE.SRGBColorSpace;

// BoxGeometry是创建一个立方体，4000是x轴，300是y轴，3000是z轴
const geometry=new THREE.BoxGeometry(4000,300,3000)
// MeshLambertMaterial 漫反射材质
const material=new THREE.MeshLambertMaterial({
  // color:new THREE.Color('grey')
  map:texture,
  aoMap:texture
})

const foundation=new THREE.Mesh(geometry,material)
// 让地基向下移动10个单位，避免闪烁问题(结合使用logarithmicDepthBuffer解决)
foundation.translateY(-10)
export default foundation
