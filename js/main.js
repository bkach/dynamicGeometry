// Scene
var scene = new THREE.Scene();

// Camera
var camera = new THREE.PerspectiveCamera(45, 
    window.innerWidth / window.innerHeight, 1, 10000);
camera.position.z = 70;
scene.add(camera);

var axisHelper = new THREE.AxisHelper( 5 );
scene.add( axisHelper );

// Controls
var controls = new THREE.TrackballControls(camera);

// Renderer
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

MAX_POINTS = 10000;
var startingPoint = new THREE.Vector3(0,0,0);
var startingFace = new THREE.Face3(0,1,2);
var geo = new THREE.Geometry();
for(i=0; i < MAX_POINTS; i++){
  geo.vertices.push(startingPoint.clone());
  geo.faces.push(startingFace.clone());
}
// bottom left 0
geo.vertices[0] = new THREE.Vector3(-5,-5,0);
// bottom right 1
geo.vertices[1] = new THREE.Vector3(5,-5,0);
// upper left 2
geo.vertices[2] = new THREE.Vector3(-5,5,0);
// upper right 3
geo.vertices[3] = new THREE.Vector3(5,5,0);


geo.faces[0] = new THREE.Face3(2,0,3);
geo.faces[1] = new THREE.Face3(0,1,3);

geo.computeFaceNormals();
geo.computeVertexNormals();

var mesh = new THREE.Mesh(
    geo,
    new THREE.MeshNormalMaterial()
    );

scene.add(mesh);

// Render and animate
var i = 2;
var render = function(){

    // upper left 4 and on
    mesh.geometry.vertices[2*i] = ( new THREE.Vector3( -5, 10 + i, -i*3 ) );
    // upper left 5 and on
    mesh.geometry.vertices[(2*i)+1] = ( new THREE.Vector3( 5, 10 + i, -i*3 ) );

    mesh.geometry.faces[(i-1)*2] = ( new THREE.Face3(2+(i),0+(i),3+(i)) );
    mesh.geometry.faces[((i-1)*2)+1] = ( new THREE.Face3(0+(i),1+(i),3+(i)) );

    geo.computeFaceNormals();
    //geo.computeVertexNormals();

    i+=2;
    console.log(((i-1)*2)+1);

    mesh.geometry.verticesNeedUpdate = true;
    mesh.geometry.elementsNeedUpdate = true;
    controls.update();
    renderer.render(scene,camera);
}

var animate = function(){
    setTimeout(animate,1000/1);
    //requestAnimationFrame( animate );
    render();
}
animate();
