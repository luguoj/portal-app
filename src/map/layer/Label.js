Ext.define('PSR.map.layer.Label', {
    xtype: 'psr-map-layer-label',
    config: {
        layerId: 'label-default',
        map: null,
        options: {}
    },
    constructor: function (config) {
        this.initConfig(config);
        const map = this.getMap();
        if (map) {
            this.layer = new TMap.MultiLabel({
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
        styles[id] = new TMap.LabelStyle(opt);
        this.layer.setStyles(styles);
    },
    update: function (geometries) {
        for (let i = 0; i < geometries.length; i++) {
            const geometry = geometries[i];
            geometry.position = PSR.Map.createLatLng(geometry.position);
        }
        this.layer.updateGeometries(geometries);
    },
    remove: function (ids) {
        this.layer.remove(ids)
    },
    on: function (event, listener) {
        this.layer.on(event, listener);
    },
});