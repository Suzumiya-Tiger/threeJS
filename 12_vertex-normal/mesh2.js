import * as THREE from 'three';

// BufferGeometry是几何体的基类，用于存储几何体的顶点位置、法线、颜色等数据
const geometry = new THREE.BufferGeometry();

const vertices=new Float32Array([
  0,0,0,
  100,0,0,
  0,100,0,
  100,100,-100
])
// 3个为一组，表示一个顶点的xyz坐标
const attribute=new THREE.BufferAttribute(vertices,3)
// 设置几何体的顶点位置
geometry.attributes.position=attribute
// 设置几何体的顶点索引
const indexes=new Uint16Array([
  0,1,2,2,1,3
])
// 设置几何体的顶点索引
geometry.index=new THREE.BufferAttribute(indexes,1)

// 必须要定义法线，否则无法计算光照
const normals=new Float32Array([
  0,0,1, // 顶点0的法线 (指向Z轴正方向)
  0,0,1, // 顶点1的法线 (指向Z轴正方向)
  0,0,1, // 顶点2的法线 (指向Z轴正方向)
  1,1,0, // 顶点3的法线 (指向X轴正方向)
])
//  geometry.attributes.normal 记录了和顶点一一对应的法线方向。
geometry.attributes.normal=new THREE.BufferAttribute(normals,3)

// MeshPhongMaterial是Phong光照模型，可以模拟真实的光照效果,并且支持调节光泽度
const material=new THREE.MeshPhongMaterial({
  color:new THREE.Color('orange'),
  shininess:1000,
  // 光泽度，值越大，光泽度越高，表面越光滑
  // 0-1000，默认30
  // 如果设置为0，则表示没有光泽度，表面是哑光的
  // 如果设置为1000，则表示表面非常光滑，有镜面反射效果
  // 如果设置为500，则表示表面有一定的光泽度，有轻微的镜面反射效果
  // 如果设置为200，则表示表面有一定的光泽度，有轻微的镜面反射效果
})

const mesh=new THREE.Mesh(geometry,material)

export default mesh