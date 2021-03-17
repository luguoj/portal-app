1. 复制css/js文件到resources/desktop目录下
2. 删除首页<body>标签
3. 首页<header>标签中的<script>前引入
```html
<link href="resources/desktop/desktop-index.css" rel="stylesheet">
<script src="resources/desktop/desktop-index.js"></script> 
```
4. 首页<header>标签中的<script>脚本前面插入
```js
initDesktopEnv({
    // 客户端站点地址
    clientSite: 'http://172.22.0.175/extapp-sso-client-site',
    // API网关站点地址
    gatewaySite: 'http://172.22.0.77',
    // WebSocket网关站点地址
    wsGatewaySite: 'ws://172.22.0.77',
    // 模块发布站点地址
    moduleSite: 'http://172.22.0.177/extmodule',
    // 启动背景图片地址
    background: 'http://ekp.king-long.com.cn/resource/style/default/login_single_random/images/login_bg03.jpg'
});
```