import * as itowns from 'itowns';
import * as THREE from 'three';

let colorize = () => new THREE.Color(0x00ff55);
let extrudeBuildings = (p) => p.hauteur;

async function createGeomLayer(json, id, globeView){
    const features = await itowns.Fetcher.json(json).
    then(json => itowns.GeoJsonParser.parse(json, {  crsOut: globeView.referenceCrs }));
    
    let options = {
        extrude: extrudeBuildings,
        color: colorize,
    }
    let obj = itowns.Feature2Mesh.convert(options)(features);    
    let layer = new itowns.GeometryLayer(id, obj);
    layer.type = 'geometry';
    layer.update = itowns.FeatureProcessing.update; 
    layer.tileInsideLimit = () => false;

    layer.threejsLayer = globeView.mainLoop.gfxEngine.getUniqueThreejsLayer();
    obj.layers.set(layer.threejsLayer);
    obj.layer = layer.id;
    for (const c of obj.children) {
        c.layer = layer.id;
        c.layers.set(layer.threejsLayer)
    };
    
    return layer;
}

export { createGeomLayer };