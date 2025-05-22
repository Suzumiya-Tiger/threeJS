import * as THREE from 'three';
import foundation from './foundation.js';
import sideWall from './side-wall.js';
import behindWall from './behind-wall.js';
import frontWall from './front-wall.js';
import roof from './roof.js';
import doorstep from './doorstep.js';
// 创建一个组，将基础添加到组中
const house = new THREE.Group();
// clone()可以实现克隆
const sideWall2=sideWall.clone()

/**
 * 左边第一个墙,自己调整效果就可以了
 * 旋转90度
 * 移动到z轴-2000
 * 移动到x轴1500
 * 移动到y轴150
 */
sideWall.rotateY(Math.PI/2)
sideWall.translateZ(-2000)
sideWall.translateX(1500)
sideWall.translateY(150)

// 第二个墙
sideWall2.rotateY(Math.PI/2)
sideWall2.translateZ(1900)
sideWall2.translateX(1500)
sideWall2.translateY(150)


house.add(foundation);
house.add(sideWall);
house.add(sideWall2)
house.add(behindWall)
house.add(frontWall)
house.add(roof)


const roof2=roof.clone()
roof2.rotateX(70/180*Math.PI)
roof2.position.z=-roof.position.z

house.add(roof2)
house.add(doorstep)
export default house;