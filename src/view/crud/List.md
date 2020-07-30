# List
## 1 成员属性
- isTree: false 树形清单标识
- columns: [] 清单列定义
- actionColumns: [] 操作列定义

根据此项配置热链创建操作列，并在controller自动创建action对应名称的函数

执行操作触发action对应名称的事件，参数1为对应记录/选中的记录

样例：
```js
actionColumns:[{action:'goResources',text:'资源'}]
```
- searchFields: [] 搜索字段

注意：如果没有搜索字段则会使用过滤器
- actionToolbars: [] 操作工具栏 
## 2 配置项
- actions: {create: true,clone: true,delete: true} 操作可用性

可加入自定义操作
## 3 viewModel
- data.actions: {create:true,delete:true,clone:true} 操作可用性
- tbsearch.searchFilterShowed 搜索工具栏搜索过滤器显示标识
- grdselection 非路径选中项
- grd 表格组件引用
- stores需实现entities

样例：
```js
entities = {
    type: 'resourcetree',
    filterer: 'bottomup',
    autoLoad: true
}
```
注意：
1. store需实现displaytext字段作为记录可视化标识

用于清单过滤,明细表单抬头,自定义子视图抬头等场合

样例：
```js
store.fields = ['code', 'description', {
        name: 'displaytext',
        calculate: function (data) {
            return data.code + ' - ' + data.description;
        }
    }]
treestore.fields = ['isPath', 'code', 'description', 'text', {
        name: 'displaytext',
        calculate: function (data) {
            return data.isPath ? data.text : (data.code + ' - ' + data.description);
        }
    }]
```
2. 如果树形表格需使用treestore
3. 树形表格如果使用过滤器则store需要增加filterer: 'bottomup'配置
## 4 controller
- 需实现getService:function()

样例：
```js
getService = function() {
    return Oauth2ServerManagementDesktopApp.service.Resource;
}
```

