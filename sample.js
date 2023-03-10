

const scene = new THREE.Scene();
const camera = new THREE.Camera();
scene.add(camera)
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const ArToolkitSource = new THREEx.ArToolkitSource({
  sourceType: "webcam",
})

ArToolkitSource.init(function() {
  setTimeout(() => {
    ArToolkitSource.onResizeElement()
    ArToolkitSource.copyElementSizeTo(renderer.domElement)
  }, 2000)
})

const ArToolkitContext = new THREEx.ArToolkitContext({
  cameraParametersUrl: '/camera_para.dat',
  detectionMode: 'color_and_matrix',
})

ArToolkitContext.init(function(){
  camera.projectionMatrix.copy(ArToolkitContext.getProjectionMatrix())
})

const ArMarkerControls = new THREEx.ArMarkerControls(ArToolkitContext, camera, {
  type: 'pattern',
  patternUrl: '/pattern.patt',
  changeMatrixMode: 'cameraTransformMatrix'
})

scene.visible = false

const geometry = new THREE.CubeGeometry( 1, 1, 1 );
const material = new THREE.MeshNormalMaterial( {
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide
} );
const cube = new THREE.Mesh( geometry, material );
// setTimeout(() => {
//   cube.position.y = geometry.parameters.height / 2
scene.add(cube);
// },2000)
window.addEventListener('deviceorientation', (event) => {
  // Get the phone's rotation in radians
  const alpha = event.alpha * Math.PI / 180; // Z-axis rotation
  const beta = event.beta * Math.PI / 180; // X-axis rotation
  const gamma = event.gamma * Math.PI / 180; // Y-axis rotation

  // Calculate the cube's new position based on the phone's rotation
  const x = Math.sin(alpha) * Math.sin(beta) * 5; // Multiplier determines sensitivity
  const y = Math.cos(alpha) * Math.sin(beta) * 5;
  const z = -Math.cos(beta) * 5;

  // Set the cube's position in the scene
  cube.position.set(x, y, z);
});

function animate() {
  requestAnimationFrame( animate );

  ArToolkitContext.update(ArToolkitSource.domElement)
  scene.visible = camera.visible

  // if (camera.visible) {
  //   cube.position.y = geometry.parameters.height / 2
  // }
  renderer.render( scene, camera );
}
animate();