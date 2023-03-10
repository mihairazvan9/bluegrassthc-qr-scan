const scene = new THREE.Scene();

// Create a new camera for the raycaster
const raycasterCamera = new THREE.PerspectiveCamera();
raycasterCamera.position.set(0, 0, 0);
raycasterCamera.lookAt(scene.position);

let mouse = new THREE.Vector2();
let intersects = [];

let raycaster = new THREE.Raycaster();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const ArToolkitSource = new THREEx.ArToolkitSource({
  sourceType: "webcam",
})

// Add an event listener for clicks
window.addEventListener('mousedown', onMouseDown, false);

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

  // Set the properties of the new camera to match the ARToolkitContext camera
  raycasterCamera.projectionMatrix.copy(ArToolkitContext.getProjectionMatrix());
  // raycasterCamera.matrixWorldInverse.fromArray(ArToolkitContext.getCameraMatrix());
})

const ArMarkerControls = new THREEx.ArMarkerControls(ArToolkitContext, raycasterCamera, {
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
cube.addEventListener('click', () => {
  console.log('Cube clicked');
  window.open('https://www.google.com/', '_blank');

});
function onMouseDown(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, raycasterCamera);
  intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0 && intersects[0].object === cube) {
    console.log(intersects)
    console.log('Clicked on object:', intersects[0].object);
  }
}
function animate() {
  requestAnimationFrame( animate );

  ArToolkitContext.update(ArToolkitSource.domElement)
  scene.visible = raycasterCamera.visible

  renderer.render( scene, raycasterCamera );
}

animate();