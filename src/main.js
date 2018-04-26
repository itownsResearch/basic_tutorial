import * as itowns from 'itowns';
import DARK from './layers/DARK'

let positionOnGlobe = { longitude: 2.351323, latitude: 48.856712, altitude: 25000000 };
let viewerDiv = document.getElementById('viewerDiv');

let globeView = new itowns.GlobeView(viewerDiv, positionOnGlobe);
globeView.addLayer(DARK); //.then(() => true);
