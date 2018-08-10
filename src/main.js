import * as itowns from 'itowns';
import DARK from './layers/DARK';
import bati from './layers/bati';
import parcelles_raster from './layers/parcelles_raster';
import GuiTools from './GUI/GuiTools';
import { createGeomLayer } from './utils/Json2GeomLayer';
import { addMeshToScene } from './utils/CreateMesh'

let positionOnGlobe = { longitude: 2.46315, latitude: 48.819609, altitude: 5500 };
let viewerDiv = document.getElementById('viewerDiv');
let htmlInfo = document.getElementById('info');

let globeView = new itowns.GlobeView(viewerDiv, positionOnGlobe);

const menuGlobe = new GuiTools('menuDiv', globeView);

function pickingRaster(event) {
    let layer = globeView.getLayers(l => l.id == parcelles_raster.id)[0];
    if (layer.visible == false)
        return;
    let geocoord = globeView.controls.pickGeoPosition(globeView.eventToViewCoords(event));
    if (geocoord === undefined)
        return;
    let result = itowns.FeaturesUtils.filterFeaturesUnderCoordinate(geocoord, layer.feature, 5);
    htmlInfo.innerHTML = 'Parcelle';
    htmlInfo.innerHTML += '<hr>';
    if (result[0] !== undefined) {
        const props = result[0].feature.properties
        for (const k in props) {
            if (k === 'bbox' || k === 'geometry_name')
                continue;
            htmlInfo.innerHTML += '<li>' + k + ': ' + props[k] + '</li>';
        }
    }
}

function pickingGeomLayer(event) {
    const layer_is_visible = globeView.getLayers(l => l.id == 'simulsFeats')[0].visible;
    if (!layer_is_visible)
        return;
    let results = globeView.pickObjectsAt(event, 5, 'simulsFeats');
    if (results.length < 1)
        return;
    htmlInfo.innerHTML = 'Batiment';
    htmlInfo.innerHTML += '<hr>';
    let props = results[0].object.properties;
    for (const k in props) {
        if (k === 'bbox' || k === 'geometry_name' || k === 'id' || k === 'id_parc' || k === 'imu_dir')
            continue;
        htmlInfo.innerHTML += '<li><b>' + k + ':</b> [' + props[k] + ']</li>';
    }
};

let layersLoaded = async function loadLayers() {
    console.log('loading dark');
    const dark = await globeView.addLayer(DARK).then(() => true).catch((r) => { console.error(r); return false });
    console.log('--dark done');
    console.log('loading bati');
    const batitopo = await globeView.addLayer(bati).then(() => true).catch((r) => { console.error(r); return false });
    console.log('--bati done');
    console.log('loading parcelles');
    const parcelles = await globeView.addLayer(parcelles_raster).then(() => true).catch((r) => { console.error(r); return false });
    console.log('--parcelles done');
    console.log('loading bati simulé');
    let geomLayer = await createGeomLayer('./data/simuls_sample.json', 'simulsFeats', globeView);
    let simuls = await globeView.addLayer(geomLayer).then(() => true).catch((r) => { console.error(r); return false });;
    console.log('bati simulé done');
    return dark && batitopo && parcelles && simuls;
}();

globeView.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, async () => {
    console.log('globe initialized');
    if (await layersLoaded) {
        console.log('layers loaded!');
        console.log('adding layers to menu!');
        menuGlobe.addImageryLayersGUI(globeView.getLayers(l => l.type === 'color'));
        menuGlobe.addGeometryLayersGUI(globeView.getLayers(l => l.type === 'geometry' && l.id != 'globe'));
        addMeshToScene(globeView);
        console.log('menu completed');
        window.addEventListener('mousemove', pickingRaster, false);
        window.addEventListener('mousemove', pickingGeomLayer, false);
    } else {
        console.error('something bad happened during layers loading..');
    }
});

