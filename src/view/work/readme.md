- subViewConfigs 定义子视图
默认主视图：main,会在构造完成后自动渲染

父子试图导航实现：
父->子
- goSubView 跳转子视图函数
参数：
1. view,视图名称
2. opt,子视图加载函数传入参数

子视图需实现方法函数：load(opt,callback)
参数：
1. opt,子视图加载函数传入参数
2. callback,完成加载并设置title后调用此方法
子->父
子视图默认监听事件：goback
参数：
1. opt,上级视图加载传入参数
事件行为：跳转回上一级视图,并调用上一级视图load方法
