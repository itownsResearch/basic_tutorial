import * as itowns from 'itowns';
import * as THREE from 'three';

function extrudeBuildings(properties) {
    return properties.hauteur;
}

let bati ={
    type: 'geometry',
    update: itowns.FeatureProcessing.update,
    convert: itowns.Feature2Mesh.convert({
        color: () => new THREE.Color(0xcab0ff),
        extrude: extrudeBuildings,
        altitude: () => 0, }),
    //onMeshCreated: ,
    //filter: acceptFeature,
    url: 'https://wxs.ign.fr/oej022d760omtb9y4b19bubh/geoportail/wfs?',
    networkOptions: { crossOrigin: 'anonymous' },
    protocol: 'wfs',
    version: '2.0.0',
    id: 'WFS Buildings',
    typeName: 'BDTOPO_BDD_WLD_WGS84G:bati_remarquable,BDTOPO_BDD_WLD_WGS84G:bati_indifferencie,BDTOPO_BDD_WLD_WGS84G:bati_industriel',
    level: 15,
    projection: 'EPSG:4326',
    ipr: 'IGN',
    format: 'application/json',
}

export default bati;
