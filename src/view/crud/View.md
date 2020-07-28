# View
## 1. 成员属性
- listViewXtype: '' 列表视图xtype
- listListeners: {} 列表视图自定义事件监听
- detailsViewXtype: '' 明细视图xtype
## 2. 配置项
- items: [] 子视图定义

样例:
```js
subView = {
    xtype: 'dialog',
    width: 400, maxHeight: '80%',
    layout: 'hbox', padding: 0,
    items: [{
        xtype: 'subViewXtype',
        flex: 1,
        listeners: {
            goback: 'goBack'
        }
    }]
}
```
注意：子视图需实现loadEntity: function(record)
- actions: {create: true,clone: true,delete: true,update: true} 操作可用性

此配置将传递给子视图

## 3. controller
- goSubView: function (viewindex, record) 跳转到对应序号子视图容器

注意：自定义子视图序号从2开始,0为listview,1为detailsview 

