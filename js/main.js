// Scene
var scene = new THREE.Scene();

// Camera
var camera = new THREE.PerspectiveCamera(45, 
    window.innerWidth / window.innerHeight, 1, 10000);
camera.position.z = 70;
scene.add(camera);

var axisHelper = new THREE.AxisHelper( 30 );
scene.add( axisHelper );

// Controls
var controls = new THREE.TrackballControls(camera);

// Renderer
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xfffffff);
document.body.appendChild(renderer.domElement);

MAX_POINTS = 10000;
var startingPoint = new THREE.Vector3(0,0,0);
var startingFace = new THREE.Face3(0,1,2);
var geo = new THREE.Geometry();
for(i=0; i < MAX_POINTS; i++){
  geo.vertices.push(startingPoint.clone());
  geo.faces.push(startingFace.clone());
}

//bottom
//First row

geo.vertices[0] = new THREE.Vector3( -30,  0,  0 );
geo.vertices[1] = new THREE.Vector3( -20,  0,  0 );
geo.vertices[2] = new THREE.Vector3( -10,  0,  0 );
geo.vertices[3] = new THREE.Vector3(   0,  0,  0  );
geo.vertices[4] = new THREE.Vector3(  10,  0,  0 );
geo.vertices[5] = new THREE.Vector3(  20,  0,  0 );
geo.vertices[6] = new THREE.Vector3(  30,  0,  0 );

var mesh = new THREE.Mesh(
    geo,
    new THREE.MeshNormalMaterial()
    );

scene.add(mesh);

window.addEventListener("click",onClick);

var numLevels = 1;
var boxesPerRow = 6;
var boxSize = 10;
var leftBoundary = -1 * (boxSize * boxesPerRow / 2);
function onClick(e){
  console.log("click");
  // Create points
  for(var i=0; i < boxesPerRow; i++){
    mesh.geometry.vertices[(boxesPerRow+1) * numLevels + i] = new THREE.Vector3(
        leftBoundary + (boxSize*i),
        numLevels*boxSize,
        0);
  }
  // Create faces
  for(var i=0; i < boxesPerRow; i++){
    mesh.geometry.faces[2*boxesPerRow*numLevels+(2*i)] = new THREE.Face3(
        (numLevels*(boxesPerRow+1)) + i,
        ((numLevels-1) * (boxesPerRow+1) + i),
        (numLevels*(boxesPerRow+1)) + i + 1
        );
    mesh.geometry.faces[2*boxesPerRow*numLevels+(2*i)+1] = new THREE.Face3(
        ((numLevels-1) * (boxesPerRow+1) + i), //0
        ((numLevels-1) * (boxesPerRow+1) + i + 1), //1
        (numLevels*(boxesPerRow+1)) + i + 1 //8
      );
  }
  mesh.geometry.computeFaceNormals();
  mesh.geometry.computeVertexNormals();
  mesh.geometry.verticesNeedUpdate = true;
  mesh.geometry.elementsNeedUpdate = true;
  numLevels++;
}

// Render and animate
var render = function(){
    controls.update();
    renderer.render(scene,camera);
}

var animate = function(){
    //setTimeout(animate,1000/1);
    requestAnimationFrame( animate );
    render();
}
animate();
