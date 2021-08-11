Ext.define('PSR.panel.Map', {
    xtype: 'psr-panel-map',
    extend: 'Ext.Component',
    config: {
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
    constructor: function (config) {
        const me = this;
        me.callParent([config]);
    },
    getMap: function () {
        return this.map;
    },
    updateCenter: function (position) {
        if (this.map) {
            this.map.setCenter(PSR.panel.Map.createLatLng(position));
        }
    },
    afterRender: function () {
        const map = this.map = new TMap.Map(this.element.dom.id, {
            rotation: this.getRotation(), //设置地图旋转角度
            pitch: this.getPitch(), //设置俯仰角度（0~45）
            zoom: this.getZoom(),//设置地图缩放级别
            center: PSR.panel.Map.createLatLng(this.getCenter()),//设置地图中心点坐标
            boundary: PSR.panel.Map.createLatLngBounds([this.getSouthwest(), this.getNortheast()]),//设置地图显示范围
            draggable: this.getDraggable(),
            scrollable: this.getScrollable(),
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
        if (this.getLayerId()) {
            TMap.ImageTileLayer.createCustomLayer({
                layerId: this.getLayerId(),
                map: map
            });
        }
        // 创建点标记图层
        this.layers.marker.layer = new TMap.MultiMarker({
            id: "marker-layer", //图层id
            map: map,
            styles: {},
            geometries: []
        });
        this.layers.label.layer = new TMap.MultiLabel({
            id: 'label-layer',
            map: map,
            styles: {},
            geometries: []
        });
        this.layers.polyline.layer = new TMap.MultiPolyline({
            id: 'polyline-layer', //图层id
            map: map, //设置多边形图层显示到哪个地图实例中
            //多边形样式
            styles: {},
            //多边形数据
            geometries: []
        });
        this.layers.polygon.layer = new TMap.MultiPolygon({
            id: 'polygon-layer', //图层id
            map: map, //设置多边形图层显示到哪个地图实例中
            //多边形样式
            styles: {},
            //多边形数据
            geometries: []
        });
        this.layers.circle.layer = new TMap.MultiCircle({
            id: 'circle-layer', //图层id
            map: map, //设置多边形图层显示到哪个地图实例中
            //多边形样式
            styles: {},
            //多边形数据
            geometries: []
        })
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
    layers: {
        marker: {
            style: function (id, opt) {
                const styles = this.layer.getStyles();
                styles[id] = new TMap.MarkerStyle(opt);
                this.layer.setStyles(styles);
            },
            update: function (geometries) {
                for (const geometry of geometries) {
                    geometry.position = PSR.panel.Map.createLatLng(geometry.position);
                }
                this.layer.updateGeometries(geometries);
            },
            remove: function (ids) {
                this.layer.remove(ids)
            },
            move: function (move, opt) {
                this.layer.moveAlong(move, opt);
            },
            on: function (event, listener) {
                this.layer.on(event, listener);
            }
        },
        label: {
            style: function (id, opt) {
                const styles = this.layer.getStyles();
                styles[id] = new TMap.LabelStyle(opt);
                this.layer.setStyles(styles);
            },
            update: function (geometries) {
                for (const geometry of geometries) {
                    geometry.position = PSR.panel.Map.createLatLng(geometry.position);
                }
                this.layer.updateGeometries(geometries);
            },
            remove: function (ids) {
                this.layer.remove(ids)
            },
            on: function (event, listener) {
                this.layer.on(event, listener);
            },
        },
        polyline: {
            style: function (id, opt) {
                const styles = this.layer.getStyles();
                styles[id] = new TMap.PolylineStyle(opt);
                this.layer.setStyles(styles);
            },
            update: function (geometries) {
                for (const geometry of geometries) {
                    if (geometry.rainbowPaths) {
                        for (const rainbowPath of geometry.rainbowPaths) {
                            for (let i = 0; i < rainbowPath.path.length; i++) {
                                rainbowPath.path[i] = PSR.panel.Map.createLatLng(rainbowPath.path[i]);
                            }
                        }
                    } else if (geometry.paths) {
                        for (const path of geometry.paths) {
                            for (let i = 0; i < path.length; i++) {
                                path[i] = PSR.panel.Map.createLatLng(path[i]);
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
            },
        },
        polygon: {
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
                for (const geometry of geometries) {
                    if (geometry.paths) {
                        for (const path of geometry.paths) {
                            for (const pathElement of path) {
                                for (let i = 0; i < pathElement.length; i++) {
                                    pathElement[i] = PSR.panel.Map.createLatLng(pathElement[i]);
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
            },
        },
        circle: {
            style: function (id, opt) {
                const styles = this.layer.getStyles();
                styles[id] = new TMap.CircleStyle(opt);
                this.layer.setStyles(styles);
            },
            update: function (geometries) {
                for (const geometry of geometries) {
                    if (geometry.rainbowPaths) {
                        for (const rainbowPath of geometry.rainbowPaths) {
                            for (let i = 0; i < rainbowPath.path.length; i++) {
                                rainbowPath.path[i] = PSR.panel.Map.createLatLng(rainbowPath.path[i]);
                            }
                        }
                    } else if (geometry.paths) {
                        for (const path of geometry.paths) {
                            for (let i = 0; i < path.length; i++) {
                                path[i] = PSR.panel.Map.createLatLng(path[i]);
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
            },
        }
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