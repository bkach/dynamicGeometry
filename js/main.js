// Scene
var scene = new THREE.Scene();

// Camera
var camera = new THREE.PerspectiveCamera(45, 
    window.innerWidth / window.innerHeight, 1, 10000);
scene.add(camera);

var axisHelper = new THREE.AxisHelper( 30 );
scene.add( axisHelper );

// Controls
// var controls = new THREE.TrackballControls(camera);
// controls.target.x += camera.position.x;

// Renderer
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xfffffff);
document.body.appendChild(renderer.domElement);

MAX_POINTS = 10000;
var startingPoint = new THREE.Vector3(0,0,0);
var startingFace = new THREE.Face3(0,0,0);
var geo = new THREE.Geometry();
for(i=0; i < MAX_POINTS; i++){
  geo.vertices.push(startingPoint.clone());
  geo.faces.push(startingFace.clone());
}

var mesh = new THREE.Mesh(
    geo,
    new THREE.MeshNormalMaterial()
    );

mesh.position.y += 10
mesh.frustumCulled = false;

mesh.geometry.computeFaceNormals();
mesh.geometry.computeVertexNormals();

scene.add(mesh);

window.addEventListener("click",onClick);

var currentRow = 0;
var rows = 150;
var size = 10;

camera.position.x = (rows * size) / 2;
camera.position.z = (rows * size) / 2;

function onClick(e){
  if(currentRow == 0){
    // create initial points - c for column
    for(var c=0; c < rows; c++){
      geo.vertices[c] = new THREE.Vector3(c * size, 0, 0);
    }
    currentRow++;
  }
  else{
    // Create points
    for(var c=0; c < rows+1; c++){
      mesh.geometry.vertices[currentRow * (rows+1) + c] = new THREE.Vector3(
          size*c,
          currentRow*size,
          Math.random() * 40);
    }
    // Create faces
    for(var c=0; c < rows; c++){
      mesh.geometry.faces[2*rows*currentRow+(2*c)] = new THREE.Face3(
          (currentRow*(rows+1)) + c,
          ((currentRow-1) * (rows+1) + c),
          (currentRow*(rows+1)) + c + 1);
      mesh.geometry.faces[2*rows*currentRow+(2*c)+1] = new THREE.Face3(
          ((currentRow-1) * (rows+1) + c), //0
          ((currentRow-1) * (rows+1) + c + 1), //1
          (currentRow*(rows+1)) + c + 1 //8
        );
    }
    mesh.geometry.verticesNeedUpdate = true;
    mesh.geometry.elementsNeedUpdate = true;
    mesh.geometry.normalsNeedUpdate = true;
    mesh.geometry.computeFaceNormals();
    mesh.geometry.computeVertexNormals();
    currentRow++;

    mesh.position.y -= 10;
  }
}

// Render and animate
var render = function(){
    // controls.update();
    renderer.render(scene,camera);
}

var animate = function(){
    //setTimeout(animate,1000/1);
    requestAnimationFrame( animate );
    render();
}
animate();
