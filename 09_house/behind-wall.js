import * as THREE from 'three';

// —— 1. 创建一个纹理加载器，用于加载外部图片资源
const loader = new THREE.TextureLoader();

// —— 2. 用加载器加载本地的墙面贴图（砖块纹理）
//    注意：路径根据你的项目结构可能需要调整
const texture = loader.load('./assets/zhuan.png');

// —— 3. 设置贴图的色彩空间
//    默认贴图是线性空间，设置为 sRGB 空间可以保证在物理光照下颜色更自然
texture.colorSpace = THREE.SRGBColorSpace;

// —— 4. 设置贴图在水平方向（S 轴）上的重复模式
//    RepeatWrapping 表示超过 [0,1] 区间后的纹理会重复平铺
texture.wrapS = THREE.RepeatWrapping;

// —— 5. 设置贴图在 S 轴上重复的次数
//    repeat.x = 2 表示将纹理在 X 方向重复两次
texture.repeat.x = 2;



// —— 6. 创建一个 BoxGeometry（长方体几何体）
//    参数：宽度 4000，高度 2000，深度 100
const geometry = new THREE.BoxGeometry(4000, 2000, 100);

// —— 7. 创建一个支持光照的 Lambert 漫反射材质
const material = new THREE.MeshLambertMaterial({
  // 如果你想用纯色，可以取消下面两行注释，使用浅灰色：
  // color: new THREE.Color('lightgrey'),

  // 用加载好的贴图作为漫反射纹理（map）
  map: texture,

  // 同样用它作为环境光遮蔽贴图（aoMap），增强凹陷部分的阴影效果
  aoMap: texture
});

// —— 8. 用几何体和材质创建一个网格对象
const behindWall = new THREE.Mesh(geometry, material);

// —— 9. 将墙体稍微向上抬升 1150 单位，避免与地面重合
behindWall.translateY(1150);

// —— 10. 向场景后方（-Z 方向）移动 1450 单位，放置在房屋后墙位置
behindWall.translateZ(-1450);

// —— 11. 导出这个后墙对象，以便在主场景或 “house” 组里使用
export default behindWall;
