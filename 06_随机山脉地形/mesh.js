import * as THREE from 'three'
import { createNoise2D } from 'simplex-noise'
const geometry = new THREE.PlaneGeometry(3000, 3000, 100, 100)
const noise2D = createNoise2D()

export function updatePosition() {
  const positions = geometry.attributes.position

  for (let i = 0; i < positions.count; i++) {
    // positions.setZ(i, Math.random() * 50)

    const x = positions.getX(i)
    const y = positions.getY(i)

    // const z = noise2D(x / 100, y / 100) * 50
    // 如果你希望坡度缓一点，可以除数大一点
    const z = noise2D(x / 300, y / 300) * 50
    const sinNum = Math.sin(Date.now() * 0.002 + x * 0.05) * 10
    positions.setZ(i, z + sinNum)
  }
  positions.needsUpdate = true
}

const material = new THREE.MeshBasicMaterial({
  color: new THREE.Color('orange'),
  wireframe: true
})

const mesh = new THREE.Mesh(geometry, material)
mesh.rotateX(Math.PI / 2)
console.log('mesh', mesh);

export default mesh
