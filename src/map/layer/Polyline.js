Ext.define('PSR.map.Layer.Polyline', {
    xtype: 'psr-map-layer-polyline',
    config: {
        layerId: 'polyline-default',
        map: null,
        options: {}
    },
    constructor: function (config) {
        this.initConfig(config);
        const map = this.getMap();
        if (map) {
            this.layer = new TMap.MultiPolyline({
                id: this.getLayerId(),
                map: map,
                styles: {},
                geometries: []
            });
        }
        return this;
    },
    style: function (id, opt) {
        const styles = this.layer.getStyles();
        styles[id] = new TMap.PolylineStyle(opt);
        this.layer.setStyles(styles);
    },
    update: function (geometries) {
        for (let i = 0; i < geometries.length; i++) {
            const geometry = geometries[i];
            if (geometry.rainbowPaths) {
                for (let j = 0; j < geometry.rainbowPaths.length; j++) {
                    const rainbowPath = geometry.rainbowPaths[j];
                    for (let k = 0; k < rainbowPath.path.length; k++) {
                        rainbowPath.path[k] = PSR.Map.createLatLng(rainbowPath.path[k]);
                    }
                }
            } else if (geometry.paths) {
                for (let j = 0; j < geometry.paths.length; j++) {
                    const path = geometry.paths[j];
                    for (let k = 0; k < path.length; k++) {
                        path[k] = PSR.Map.createLatLng(path[k]);
                    }
                }
            }
        }
        this.layer.updateGeometries(geometries);
    },
    remove: function (ids) {
        this.layer.remove(ids)
    },
    on: function (event, listener) {
        this.layer.on(event, listener);
    }
});