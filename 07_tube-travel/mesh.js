import * as THREE from 'three';

// 创建一条 CatmullRomCurve3 曲线，这是一条通过一系列三维点的平滑曲线
// 这些点定义了管道的路径
const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-100, 20, 90),  // 路径上的第一个点
    new THREE.Vector3(-40, 80, 100), // 路径上的第二个点
    new THREE.Vector3(0, 0, 0),       // 路径上的第三个点
    new THREE.Vector3(60, -60, 0),    // 路径上的第四个点
    new THREE.Vector3(100, -40, 80),  // 路径上的第五个点
    new THREE.Vector3(150, 60, 60)    // 路径上的第六个点
]);

// 基于上述路径创建一个管道几何体 (TubeGeometry)
// 参数：
// 1. path: 管道的路径曲线
// 2. 100 (tubularSegments): 管道沿长度方向的分段数，越大越平滑
// 3. 5 (radius): 管道的半径
// 4. 30 (radialSegments): 管道横截面的分段数，越大横截面越圆滑
const geometry = new THREE.TubeGeometry(path, 100, 5, 30);

/* 加载纹理图片 */
// 创建一个纹理加载器实例
const loader = new THREE.TextureLoader();
// 使用加载器异步加载 './stone.png' 图片文件，返回一个 Texture 对象
const texture = loader.load('./stone.png');

// 设置纹理在S轴（通常是水平方向）上的包裹方式为重复包裹
// 这意味着当UV坐标超出 [0,1] 范围时，纹理会重复自身
texture.wrapS = THREE.RepeatWrapping;

// 设置纹理的颜色空间为 SRGB，这是Web上图片常用的标准颜色空间
// 确保颜色在渲染时被正确处理
texture.colorSpace = THREE.SRGBColorSpace;

// 设置纹理在X方向（对应S轴或U轴）上的重复次数
// 这会将纹理在模型表面沿U方向平铺20次
texture.repeat.x = 20;

// 创建一个基础网格材质 (MeshBasicMaterial)
// 这种材质不受光照影响，主要由颜色或纹理决定其外观
const material = new THREE.MeshBasicMaterial({
    // map 属性用于指定基础颜色纹理
    // 模型表面的颜色将主要来自这张 'stone.png' 纹理
    map: texture,

    // aoMap (Ambient Occlusion Map) 用于模拟环境光遮蔽，增加模型的深度感
    // 通常 aoMap 是一张灰度图，这里复用了颜色纹理 'texture'
    // 这种用法可能会使纹理的暗部更暗，产生一种特殊的颗粒感或做旧效果，
    // 而不是标准的AO效果。
    aoMap: texture,

    // 设置材质为双面渲染，这样从管道内部也能看到纹理
    side: THREE.DoubleSide
});

// 使用创建的几何体和材质来创建一个网格模型 (Mesh)
// Mesh 是三维空间中的实际可见对象
const mesh = new THREE.Mesh(geometry, material);

// 在管道路径上均匀采样1000个点
export const tubePoints=path.getSpacedPoints(1000);

// 默认导出这个创建的网格模型，以便其他模块可以导入和使用它
export default mesh;
