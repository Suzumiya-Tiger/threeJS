import * as THREE from 'three'

const geometry = new THREE.PlaneGeometry(300, 300, 10, 10)

const material = new THREE.MeshBasicMaterial({
  color: new THREE.Color('orange'),
  wireframe: true
})

const mesh = new THREE.Mesh(geometry, material)

console.log('mesh', mesh);

export default mesh
