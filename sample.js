

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
  patternUrl: '/patt.patt',
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


// Add an event listener for mouse clicks
document.addEventListener('click', onClick, false);

// Define a new Raycaster object
const raycaster = new THREE.Raycaster();

// Define a new Vector2 object for storing the mouse coordinates
const mouse = new THREE.Vector2();

function onClick(event) {
  // Calculate the mouse coordinates in normalized device coordinates (NDC)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray from the camera to the mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children, true);

  // Check if the cube was clicked
  if (intersects.length > 0 && intersects[0].object === cube) {
    window.open('https://bluegrassthc.com/', '_blank')
    // Add your code for handling the cube click here
  }
}