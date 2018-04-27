import * as itowns from 'itowns';
import DARK from './layers/DARK';
import bati from './layers/bati';

let positionOnGlobe = { longitude: 2.351323, latitude: 48.856712, altitude: 2500 };
let viewerDiv = document.getElementById('viewerDiv');

let globeView = new itowns.GlobeView(viewerDiv, positionOnGlobe);

let layersLoaded = async function loadLayers() {
    console.log('loading dark');
    const dark = await globeView.addLayer(DARK).then(() => true).catch((r) => { console.error(r); return false });
    console.log('--dark done');
    console.log('loading bati');
    const batitopo = await globeView.addLayer(bati).then(() => true).catch((r) => { console.error(r); return false });
    console.log('--bati done');
    return dark && batitopo;
}();

globeView.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, async () => {
    console.log('globe initialized');
    if (await layersLoaded) {
        console.log('layers loaded!');
    } else {
        console.error('something bad happened during layers loading..');
    }
});

