import * as THREE from 'three';
// 创建一个圆柱体
// 30是半径，50是高度，1000是分段，32是圆周分段，32是顶部分段,最后一个参数是是否为空心
const geometry=new THREE.CylinderGeometry(30,50,1000,32,32,true);


const loader=new THREE.TextureLoader();
const texture=loader.load('./tunnel.png')
texture.colorSpace=THREE.SRGBColorSpace;
/**
 * 这行代码设置了纹理在 T 轴（通常对应于纹理坐标的 V 轴，即垂直方向）上的包裹方式。
 * THREE.RepeatWrapping 表示当纹理坐标超出了 [0, 1] 的范围时，纹理会进行重复平铺。
 * 想象一下用一张壁纸贴墙，如果壁纸不够长，THREE.RepeatWrapping 就会不断地重复这张壁纸来铺满整个墙面。
 * 与之相对的还有 THREE.ClampToEdgeWrapping（超出部分使用边缘像素颜色填充）和 THREE.MirroredRepeatWrapping（镜像重复）。
 */
texture.wrapT=THREE.RepeatWrapping;
/**
 * 这行代码设置了纹理在 U 轴（水平方向）和 V 轴（垂直方向）上重复的次数。
 * .set(1, 2) 表示纹理在 U 轴上不重复（重复 1 次，即原始大小），在 V 轴上重复 2 次。
 * 结合上一行 texture.wrapT = THREE.RepeatWrapping;，这意味着在垂直方向上，你会看到这个纹理被完整地绘制了两次。
 */
texture.repeat.set(1,2)

// 创建一个材质
const material=new THREE.MeshBasicMaterial({
    // color: 'orange',
    transparent:true,
    alphaMap:texture,
    // 设置纹理
    // map:texture,
    // 设置为空心，并且设置为两面可见
    // side:THREE.DoubleSide
    // 这里不需要双面可见，改为反面可见
    side:THREE.BackSide
});
// 创建一个网格
const tunnel=new THREE.Mesh(geometry,material);

export default tunnel;

