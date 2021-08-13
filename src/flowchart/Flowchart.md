# 引入
修改app.json
```json
{
  "js": [
      {"path":"common/resources/jslib/jquery-3.6.0.min.js", "bundle": false},
      {"path":"common/resources/jslib/sheetjs/xlsx.full-0.17.0.min.js", "bundle": false},
      {"path":"common/resources/jslib/lodash-4.17.15.min.js", "bundle": false},
      {"path":"common/resources/jslib/backbone-1.4.0.min.js", "bundle": false},
      {"path":"common/resources/jslib/dagre/dagre.min.js", "bundle": false},
      {"path":"common/resources/jslib/dagre/graphlib.min.js", "bundle": false},
      {"path":"common/resources/jslib/joint/joint-3.4.0.js", "bundle": false}      
    ]
}
```


```js
items:[{
    xtype: 'psr-flowchart',
    enableGrid: false, // 启用网格线
    flowOptions: {}, // 流程图配置项
    layoutDir: 'TB', // 布局方向
    layoutNodeSep: 60, // 布局节点间隔
    layoutEdgeSep: 60 // 布局边间隔
}]
```

```js
// 创建图表
flowchart.setFlowOptions({
    nodes: [{
        id: 'n1', // 节点ID
        x: 0, // 横坐标 left
        y: 0, // 纵坐标 top
        width: 38, // 最小宽度
        height: 38, // 最小高度
        bodyFillColor: '#4be0d4', // 节点填充色
        labelText: 'n1', // 节点文本
        labelFillColor: 'black' // 节点文本颜色
    },
        {id: 'n2', labelText: 'n2', x: 200},
        {id: 'n3', labelText: 'n3', x: 400},
        {id: 'n4', labelText: 'n4', x: 600},
        {id: 'n5', labelText: 'n5', x: 800}],
    links: [{
        type: 'Link', // 线型 Link/DoubleLink/ShadowLink
        lineColor: 'black', // 线色
        source: 'n1', // 源节点ID
        target: 'n2', // 目标节点ID
        labelText: 'l1' // 连接文本
    }, {source: 'n2', target: 'n3'},
        {source: 'n3', target: 'n4'},
        {source: 'n4', target: 'n5'},
        {source: 'n2', target: 'n5'}]
});
// 自动布局
flowchart.autoLayout();
// 调整画布大小
flowchart.fitToContent();
```