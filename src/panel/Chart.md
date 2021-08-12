# 引入
修改app.json
```json
{
  "js": [
        {"path":"common/resources/jslib/highcharts/highstock.js", "bundle": false},
        {"path":"common/resources/jslib/highcharts/map.js", "bundle": false},
        {"path":"common/resources/jslib/highcharts/gantt.js", "bundle": false},
        {"path":"common/resources/jslib/highcharts/highcharts-oldie-polyfills.js", "bundle": false}      
    ]
}
```