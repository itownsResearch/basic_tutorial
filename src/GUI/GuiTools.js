/**
 * Generated On: 2015-10-5
 * Class: GuiTools
 * Description: Classe pour créer un menu.
 */

 /* global dat,viewerDiv, itowns */
import dat from 'dat.gui';
import * as itowns from 'itowns';

dat.GUI.prototype.removeFolder = function removeFolder(name) {
    var folder = this.__folders[name];
    if (!folder) {
        return;
    }
    folder.close();
    this.__ul.removeChild(folder.domElement.parentNode);
    delete this.__folders[name];
    this.onResize();
};

dat.GUI.prototype.hideFolder = function hideFolder(name, value) {
    var folder = this.__folders[name];
    if (!folder) {
        return;
    }
    folder.__ul.hidden = value;
};

function GuiTools(domId, view, w) {
    var width = w || 245;
    this.gui = new dat.GUI({ autoPlace: false, width: width });
    this.gui.domElement.id = domId;
    viewerDiv.appendChild(this.gui.domElement);
    this.colorGui = this.gui.addFolder('Color Layers');
    this.geometryGui = this.gui.addFolder('Geometry Layers');
    this.elevationGui = this.gui.addFolder('Elevation Layers');

    if (view) {
        this.view = view;
        view.addEventListener('layers-order-changed', (function refreshColorGui() {
            var i;
            var colorLayers = view.getLayers(function filter(l) { return l.type === 'color'; });
            for (i = 0; i < colorLayers.length; i++) {
                this.removeLayersGUI(colorLayers[i].id);
            }

            this.addImageryLayersGUI(colorLayers);
        }).bind(this));
    }
}

GuiTools.prototype.addLayersGUI = function fnAddLayersGUI() {
    function filterColor(l) { return l.type === 'color'; }
    function filterElevation(l) { return l.type === 'elevation'; }
    this.addImageryLayersGUI(this.view.getLayers(filterColor));
    this.addElevationLayersGUI(this.view.getLayers(filterElevation));
    // eslint-disable-next-line no-console
    console.info('menu initialized');
};

GuiTools.prototype.addImageryLayerGUI = function addImageryLayerGUI(layer) {
    var folder = this.colorGui.addFolder(layer.id);
    folder.add({ visible: layer.visible }, 'visible').onChange((function updateVisibility(value) {
        layer.visible = value;
        this.view.notifyChange(layer);
    }).bind(this));
    folder.add({ opacity: layer.opacity }, 'opacity').min(0.0).max(1.0).onChange((function updateOpacity(value) {
        layer.opacity = value;
        this.view.notifyChange(layer);
    }).bind(this));
    folder.add({ frozen: layer.frozen }, 'frozen').onChange((function updateFrozen(value) {
        layer.frozen = value;
        this.view.notifyChange(layer);
    }).bind(this));
};

GuiTools.prototype.addElevationLayerGUI = function addElevationLayerGUI(layer) {
    var folder = this.elevationGui.addFolder(layer.id);
    folder.add({ frozen: layer.frozen }, 'frozen').onChange(function refreshFrozenGui(value) {
        layer.frozen = value;
    });
};

GuiTools.prototype.addImageryLayersGUI = function addImageryLayersGUI(layers) {
    var i;
    var seq = itowns.ImageryLayers.getColorLayersIdOrderedBySequence(layers);
    var sortedLayers = layers.sort(function comp(a, b) {
        return seq.indexOf(a.id) < seq.indexOf(b.id);
    });
    for (i = 0; i < sortedLayers.length; i++) {
        this.addImageryLayerGUI(sortedLayers[i]);
    }
};

GuiTools.prototype.addElevationLayersGUI = function addElevationLayersGUI(layers) {
    var i;
    for (i = 0; i < layers.length; i++) {
        this.addElevationLayerGUI(layers[i]);
    }
};

GuiTools.prototype.addGeometryLayerGUI = function addGeometryLayerGUI(layer) {
    var folder = this.geometryGui.addFolder(layer.id);
    folder.add({ visible: true }, 'visible').onChange((function updateVisibility(value) {
        layer.visible = value;
        this.view.notifyChange(layer);
    }).bind(this));
    folder.add({ opacity: 1.0 }, 'opacity').min(0.0).max(1.0).onChange((function updateOpacity(value) {
        layer.opacity = value;
        this.view.notifyChange(layer);
    }).bind(this));
    folder.add({ wireframe: false }, 'wireframe').onChange((function updateWireframe(value) {
        layer.wireframe = value;
        this.view.notifyChange(layer);
    }).bind(this));
};

GuiTools.prototype.addGeometryLayersGUI = function addGeometryLayersGUI(layers) {
    var i;
    for (i = 0; i < layers.length; i++) {
        this.addGeometryLayerGUI(layers[i]);
    }
};

GuiTools.prototype.removeLayersGUI = function removeLayersGUI(nameLayer) {
    this.colorGui.removeFolder(nameLayer);
};

export default GuiTools;
