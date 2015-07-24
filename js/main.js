// Scene
var scene = new THREE.Scene();

// Camera
var camera = new THREE.PerspectiveCamera(45, 
    window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(0,400,400);
scene.add(camera);

// Controls
var controls = new THREE.TrackballControls(camera);

var axisHelper = new THREE.AxisHelper( 30 );
scene.add( axisHelper );


// Renderer
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xfffffff);
document.body.appendChild(renderer.domElement);
window.addEventListener( 'resize', onWindowResize, false );

ROWS = 100;
NUM_POINTS_AND_FACES = 5000;
SIZE = 10;
MAXHEIGHT = 40

console.log(NUM_POINTS_AND_FACES/(ROWS * 2), "rows will be produced.")

var geo = new THREE.Geometry();
for(i=0; i < NUM_POINTS_AND_FACES; i++){
  geo.vertices.push(new THREE.Vector3(0,0,0));
  geo.faces.push(new THREE.Face3(0,0,0));
}

var mesh = new THREE.Mesh(
    geo,
    new THREE.MeshNormalMaterial()
    );

mesh.frustumCulled = false;
scene.add(mesh);

var currentRow = 0;

mesh.position.x -= ROWS*SIZE/2;
mesh.position.y -= MAXHEIGHT;

var augmentGeometry = function(){
 if(currentRow == 0){
    // create initial points - c for column
    for(var c=0; c < ROWS+1; c++){
      geo.vertices[c] = new THREE.Vector3(c * SIZE, 0, 0);
    }
    currentRow++;
  }
  else{
    // Create points
    for(var c=0; c < ROWS+1; c++){
      var initialIndex = (ROWS+1) * currentRow + c;
      mesh.geometry.vertices[initialIndex] = new THREE.Vector3(
          (SIZE*c),
          Math.random() * MAXHEIGHT,
          -currentRow*SIZE);
    }
    // Create faces
    for(var c=0; c < ROWS; c++){
      var bottomLeft = (currentRow*(ROWS+1)) + c + 1; //8
      var bottomRight = (currentRow*(ROWS+1)) + c; // 7
      var upperLeft = ((currentRow-1) * (ROWS+1) + c + 1); //1
      var upperRight = ((currentRow-1) * (ROWS+1) + c); // 0

      mesh.geometry.faces[(2*ROWS*(currentRow-1)+(2*c))%NUM_POINTS_AND_FACES] = new THREE.Face3(
          upperLeft,
          bottomLeft,
          upperRight
          );
      mesh.geometry.faces[(2*ROWS*(currentRow-1)+(2*c)+1)%NUM_POINTS_AND_FACES] = new THREE.Face3(
          bottomLeft,
          bottomRight,
          upperRight
        );
    }
    mesh.geometry.verticesNeedUpdate = true;
    mesh.geometry.elementsNeedUpdate = true;
    mesh.geometry.normalsNeedUpdate = true;
    mesh.geometry.computeFaceNormals();
    // mesh.geometry.computeVertexNormals();
    currentRow++;

    mesh.position.z += 10;
  } 
}

var onWindowResize = function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  controls.handleResize();
  render();
}

// Render and animate
var render = function(){
    renderer.render(scene,camera);
}

var animate = function(){
    requestAnimationFrame( animate );
    controls.update();
    render();
}

var geoTimeout = function(){
  setTimeout(geoTimeout,1000/20);
  augmentGeometry();
}

animate();
geoTimeout();
