import * as THREE from 'three';

const shape = new THREE.Shape();

shape.moveTo(0,0)
shape.lineTo(4000,0)
shape.lineTo(4000,2000)
shape.lineTo(0,2000)

// 创建门
const door=new THREE.Path()
door.moveTo(1000,0)
door.lineTo(2000,0)
door.lineTo(2000,1500)
door.lineTo(1000,1500)

shape.holes.push(door)

// 创建窗户
const window=new THREE.Path()
window.moveTo(2500,500)
window.lineTo(3500,500)
window.lineTo(3500,1500)
window.lineTo(2500,1500)

shape.holes.push(window)

const geometry=new THREE.ExtrudeGeometry(shape,{
  depth:100
})
const loader=new THREE.TextureLoader();
const texture=loader.load('./assets/zhuan.png')
texture.colorSpace=THREE.SRGBColorSpace;
texture.wrapS=THREE.RepeatWrapping;
texture.wrapT=THREE.RepeatWrapping;
texture.repeat.x=0.0005;
texture.repeat.y=0.0005;

const material=new THREE.MeshLambertMaterial({
  map:texture,
  aoMap:texture
})

const frontWall=new THREE.Mesh(geometry,material)
frontWall.translateX(-2000)
frontWall.translateZ(1400)
frontWall.translateY(150)

export default frontWall