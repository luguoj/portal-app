# Associataion
## 1 成员属性
- isTree: false 树形清单标识
- entitySide: 'left' or 'right' 实体在关系中的方位 
- searchFields: [] 搜索字段
- title: '关系' 关系另一方实体标签
- updateAction: 'updateAssociation' 更新关系操作名
## 2 配置项
- actions: {'$updateAction': true} 操作可用性

updateAction指定的操作
## 3 viewModel
- data.action_$updateAction: true 操作可用性
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
## 4 controller
- 需实现getService:function()

样例：
```js
getService = function() {
    return Oauth2ServerManagementDesktopApp.service.UserAuthority;
}
```

