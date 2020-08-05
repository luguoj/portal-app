# List
## 1 成员属性
- formFields: [] 表单字段
- actionToolbars: [] 操作工具栏
## 2 配置项
- actions: {create: true,update: true} 操作可用性

可加入自定义操作
## 3 viewModel
- data.actions: {create: true,update: true} 操作可用性
- tbeditor.creating 创建状态标识
- tbeditor.editing 编辑状态标识
- dirty: {isNew: false, record: null} 脏数据标识,goback事件传出此参数

create提交成功将置dirty.isNew=true,dirty.record=$resp.result

update提交成功将置dirty.record=$resp.result
## 4 controller
- 需实现getService:function()

样例：
```js
getService = function() {
    return Oauth2ServerManagementDesktopApp.service.Resource;
}
```
## 5 成员函数
- load: function(opt,callback)
参数：

1. opt: {create: false, record: null}
2. callback

