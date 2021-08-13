Ext.define('PSR.map.Layer.Polygon', {
    xtype: 'psr-map-layer-polygon',
    config: {
        layerId: 'polygon-default',
        map: null,
        options: {}
    },
    constructor: function (config) {
        this.initConfig(config);
        const map = this.getMap();
        if (map) {
            this.layer = new TMap.MultiPolygon({
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
        if (opt.extrudeHeight) {
            styles[id] = new TMap.ExtrudablePolygonStyle(opt);
        } else {
            styles[id] = new TMap.PolygonStyle(opt);
        }
        this.layer.setStyles(styles);
    },
    update: function (geometries) {
        for (let i = 0; i < geometries.length; i++) {
            const geometry = geometries[i];
            if (geometry.paths) {
                for (let j = 0; j < geometry.paths.length; j++) {
                    const path = geometry.paths[j];
                    for (let k = 0; k < path.length; k++) {
                        const pathElement = path[k];
                        for (let l = 0; l < pathElement.length; l++) {
                            pathElement[l] = PSR.Map.createLatLng(pathElement[l]);
                        }
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