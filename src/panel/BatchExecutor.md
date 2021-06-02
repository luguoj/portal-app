# 配置项
## 1. handler 记录处理函数
### 1.1.  参数清单
opt 处理选项对象
- opt.values 当前记录值对象
- opt.success:function() 当前记录处理成功回调
- opt.onErrorMessage:function(message) 当前记录失败消息回调
- opt.complete:function() 当前记录处理完成回调(无论成功/失败/异常)