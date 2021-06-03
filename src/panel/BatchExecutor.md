# 方法

## 1. execute 执行批量处理
使用案例
```js
batchExecutor.execute({
    // 过滤需要执行的任务记录条目
    filter: function (record) {
        return record.get('flag');
    },
    // 执行处理逻辑
    handler: function (opt) {
        // opt.values 当前任务记录的数据值对象
        let errorMsg = doSomething(opt.values)
        // 根据执行成功与否标记当前任务记录的处理状态
        if (errorMsg) {
            opt.onErrorMessage(errorMsg);
        } else {
            opt.success();
        }
        // 执行完成执行下一个任务记录
        opt.complete();
    }
});
```