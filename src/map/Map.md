# 引入

修改app.json

```json
{
  "js": [
    {
      "path": "https://map.qq.com/api/gljs?v=1.exp&key=446BZ-CJ6W6-SAYST-EIJAF-XEW6V-ORBWF",
      "bundle": false
    }
  ]
}
```

# 绘制地图

```js
container.add({
    xtype: 'psr-panel-map',
    mapOptions: {
        center: [24.594221617, 117.9752365],
        northeast: [24.599587, 117.980751],
        southwest: [24.588856, 117.969722],
        layerId: '5fe4439b3474' // 自定义图层ID
    }
});
```

# 标记

```js
map.layers.marker.style("marker", {
    "width": 25,
    "height": 35,
    "anchor": {x: 12, y: 35}, // 锚点，默认为{ x: width/2, y: height }
    "src": "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png",
});
map.layers.marker.update([{
    'id': 'marker', //点图形数据的标志信息
    'styleId': 'marker', //样式id
    'position': [24.594221617, 117.9752365], //标注点位置
    'content': '总部', //标注文本
    'properties': { //标注点的属性数据
        'title': 'label'
    }
}]);
```

# 运动标记

```js
map.layers.marker.style("car", {
    'width': 40,  //小车图片宽度（像素）
    'height': 40, //高度
    'anchor': {   //图片中心的像素位置（小车会保持车头朝前，会以中心位置进行转向）
        x: 20, y: 20,
    },
    'faceTo': 'map',  //取’map’让小车贴于地面，faceTo取值说明请见下文图示
    'rotate': 180,    //初始小车朝向（正北0度，逆时针一周为360度，180为正南）
    'src': 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/car.png',   //小车图片（图中小车车头向上，即正北0度）
});
map.layers.marker.update([{
    'id': 'car', //点图形数据的标志信息
    'styleId': 'car', //样式id
    'position': [24.590890, 117.974330], //标注点位置
}]);
var carPath1 = [ //多边形的位置信息
    new TMap.LatLng(24.590890, 117.974330),
    new TMap.LatLng(24.592573, 117.972388),
    new TMap.LatLng(24.595549, 117.975520),
    new TMap.LatLng(24.593895, 117.977430),
];
var carPath2 = [ //多边形的位置信息
    new TMap.LatLng(24.593895, 117.977430),
    new TMap.LatLng(24.595549, 117.975520),
    new TMap.LatLng(24.592573, 117.972388),
    new TMap.LatLng(24.590890, 117.974330),
];
var currPath = true;
map.layers.marker.move({
    'car': {path: carPath1, duration: 10000, speed: 80}
}, {
    autoRotation: true
});
map.layers.marker.on('move_ended', function () {
    map.layers.marker.move({
        'car': {path: currPath ? carPath2 : carPath1, duration: 20000, speed: 80}
    }, {
        autoRotation: true
    });
    currPath = !currPath;
});
```

# 文本标签

```js
map.layers.label.style('label', {
    'color': '#3777FF', //颜色属性
    'size': 20, //文字大小属性
    'offset': {x: 13, y: -30}, //文字偏移属性单位为像素
    'angle': 0, //文字旋转属性
    'alignment': 'left', //文字水平对齐属性
    'verticalAlignment': 'top' //文字垂直对齐属性
});
map.layers.label.update([{
    'id': 'label', //点图形数据的标志信息
    'styleId': 'label', //样式id
    'position': [24.594221617, 117.9752365], //标注点位置
    'content': '总部', //标注文本
    'properties': { //标注点的属性数据
        'title': 'label'
    }
}]);
```

# 折线

```js
map.layers.polyline.style('style_blue', {
    color: '#3777FF', //线填充色
    width: 10, //折线宽度
    borderWidth: 0, //边线宽度
    showArrow: true,
    arrowOptions: {
        space: 70
    },
    lineCap: 'round',
});
var green = 'rgba(0, 180, 0, 1)',
    red = 'rgba(255, 0, 0, 1)',
    yellow = 'rgba(204,153, 0, 1)';
var polylinePath = [
    [24.590885, 117.974335],
    [24.591480, 117.973638],
    [24.592251, 117.972747],
    [24.592573, 117.972382],
    [24.593188, 117.972972],
    [24.595266, 117.975204],
    [24.595568, 117.975537],
    [24.595188, 117.975987],
];
map.layers.polyline.update([{
    styleId: 'style_blue',
    rainbowPaths: [ // 彩虹线数组
        {
            path: [polylinePath[0], polylinePath[1]],
            color: yellow,
        },
        {
            path: [polylinePath[1], polylinePath[2]],
            color: green,
        },
        {
            path: [polylinePath[2], polylinePath[3]],
            color: red,
        },
        {
            path: [polylinePath[3], polylinePath[4]],
            color: yellow,
        },
        {
            path: [polylinePath[4], polylinePath[5]],
            color: green,
        },
        {
            path: [polylinePath[5], polylinePath[6]],
            color: red,
        },
        {
            path: [polylinePath[6], polylinePath[7]],
            color: yellow,
        }
    ],
}]);
```

# 多边形

```js
// 多边形
var polygonPath = [[[ //多边形的位置信息
    new TMap.LatLng(24.590890, 117.974330),
    new TMap.LatLng(24.592573, 117.972388),
    new TMap.LatLng(24.595549, 117.975520),
    new TMap.LatLng(24.593895, 117.977430),
]]]
map.layers.polygon.style('polygon', {
    'color': 'rgba(0,125,255,0.2)', //面填充色
    'showBorder': true, //是否显示拔起面的边线
    'extrudeHeight': 30, //多边形拔起高度
    'borderColor': 'rgba(0,125,255,1)' //边线颜色
});
map.layers.polygon.update([{
    'id': 'p1', //该多边形在图层中的唯一标识（删除、更新数据时需要）
    'styleId': 'polygon', //绑定样式名
    'paths': polygonPath, //多边形轮廓
}]);
```