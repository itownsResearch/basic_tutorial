
import * as THREE from 'three';

function generateMesh(position) {
    let geom = new THREE.CylinderBufferGeometry(50, 20, 3, 8);
    let risimat = new THREE.MeshBasicMaterial({ color: 0xff2142 });
    let mesh = new THREE.Mesh(geom, risimat);

    mesh.position.copy(position);
    mesh.lookAt(new THREE.Vector3(0, 0, 0));
    mesh.rotateX(Math.PI / 2);

    // // update coordinate of the mesh
    mesh.updateMatrixWorld();
    return mesh;
}

function addMeshToScene(globeView) {
    let position = new THREE.Vector3(4203699.112252481, 180828.76359087773, 4777410.692429126);
    let mesh = generateMesh(position);
    globeView.scene.add(mesh);
    globeView.myObj = mesh
}

export { addMeshToScene };