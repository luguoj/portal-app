Ext.define('PSR.Map', {
    xtype: 'psr-map',
    extend: 'Ext.Component',
    config: {
        mapOptions: {
            center: [0, 0],
            zoom: 13,
            pitch: 45,
            rotation: 0,
            northeast: [0, 0],
            southwest: [0, 0],
            draggable: true,
            scrollable: true,
            layerId: null
        },
        layers: []
    },
    idToLayers: {},
    getLayer: function (layerId) {
        return this.idToLayers[layerId];
    },
    constructor: function (config) {
        const me = this;
        me.callParent([config]);
    },
    setMapOptions: function (mapOptions) {
        this.callParent([Object.assign({
            center: [0, 0],
            zoom: 13,
            pitch: 45,
            rotation: 0,
            northeast: [0, 0],
            southwest: [0, 0],
            draggable: true,
            scrollable: true,
            layerId: null
        }, mapOptions)]);
    },
    afterRender: function () {
        const mapOptions = this.getMapOptions();
        map = this.map = new TMap.Map(this.element.dom.id, {
            rotation: mapOptions.rotation, //设置地图旋转角度
            pitch: mapOptions.pitch, //设置俯仰角度（0~45）
            zoom: mapOptions.zoom,//设置地图缩放级别
            center: PSR.Map.createLatLng(mapOptions.center),//设置地图中心点坐标
            boundary: PSR.Map.createLatLngBounds([mapOptions.southwest, mapOptions.northeast]),//设置地图显示范围
            draggable: mapOptions.draggable,
            scrollable: mapOptions.scrollable,
            showControl: false,//是否显示地图控件
            baseMap: {
                type: 'vector',// 矢量地图底图模式
                features: [
                    'base', // 路面
                    'building3d', //三维建筑
                    // 'point', // POI文字
                    'label' // 道路文字
                ]
            }
        });
        // 创建自定义图层
        if (mapOptions.layerId) {
            TMap.ImageTileLayer.createCustomLayer({
                layerId: mapOptions.layerId,
                map: map
            });
        }
        const layers = this.getLayers();
        for (let i = 0; i < layers.length; i++) {
            layers[i].map = map;
            this.idToLayers[layers[i].layerId] = Ext.create(layers[i]);
        }
        if (!this.idToLayers['marker-default']) {
            this.idToLayers['marker-default'] = Ext.create({xtype: 'psr-map-layer-marker', map: map});
        }
        if (!this.idToLayers['label-default']) {
            this.idToLayers['label-default'] = Ext.create({xtype: 'psr-map-layer-label', map: map});
        }
        if (!this.idToLayers['polyline-default']) {
            this.idToLayers['polyline-default'] = Ext.create({xtype: 'psr-map-layer-polyline', map: map});
        }
        if (!this.idToLayers['polygon-default']) {
            this.idToLayers['polygon-default'] = Ext.create({xtype: 'psr-map-layer-polygon', map: map});
        }
        if (!this.idToLayers['circle-default']) {
            this.idToLayers['circle-default'] = Ext.create({xtype: 'psr-map-layer-circle', map: map});
        }
    },
    zoomTo: function (zoom, opt) {
        this.map.zoomTo(zoom, opt);
    },
    rotateTo: function (rotation, opt) {
        this.map.rotateTo(rotation, opt);
    },
    pitchTo: function (pitch, opt) {
        this.map.pitchTo(pitch, opt);
    },
    easeTo: function (status, opt) {
        this.map.easeTo(status, opt);
    },
    fitBounds: function (bounds, opt) {
        this.map.fitBounds(bounds, opt);
    },
    statics: {
        createLatLng: function (position) {
            if (position instanceof TMap.LatLng) {
                return position;
            }
            return new TMap.LatLng(position[0], position[1]);
        },
        createLatLngBounds: function (bounds) {
            if (bounds instanceof TMap.LatLngBounds) {
                return bounds;
            } else {
                return new TMap.LatLngBounds(
                    this.createLatLng(bounds[0]),
                    this.createLatLng(bounds[1])
                );
            }
            return bounds;
        }
    }
});