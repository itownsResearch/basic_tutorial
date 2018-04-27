import * as itowns from 'itowns';
import DARK from './layers/DARK';
import bati from './layers/bati';
import parcelles_raster from './layers/parcelles_raster';
import GuiTools from './GUI/GuiTools';
import { createGeomLayer } from './utils/Json2GeomLayer';

let positionOnGlobe = { longitude: 2.46315, latitude: 48.819609, altitude: 5500 };
let viewerDiv = document.getElementById('viewerDiv');

let globeView = new itowns.GlobeView(viewerDiv, positionOnGlobe);

const menuGlobe = new GuiTools('menuDiv', globeView);

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
    let geomLayer = await createGeomLayer('../data/simuls_sample.json', 'simulsFeats', globeView);
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
        console.log('menu completed');
    } else {
        console.error('something bad happened during layers loading..');
    }
});

