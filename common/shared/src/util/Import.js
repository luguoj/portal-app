Ext.define('PSR.util.Import', {
    singleton: true,
    script: function (opt) {
        if (opt && opt.url) {
            if (opt.withAuthToken) {
                var token = PSR.util.Auth.getClientToken(function (token) {
                    PSR.util.Import.script(opt);
                });
                if (!token) {
                    return;
                }
                opt.params = Object.assign(
                    {},
                    opt.params,
                    {access_token: token.access_token}
                );
            }
            let url = opt.url;
            if (opt.params) {
                if (url.indexOf("?") == -1) {
                    url += "?";
                } else {
                    url += "&";
                }
                url += Ext.Object.toQueryString(opt.params)
            }
            // 导入脚本
            const scriptEl = document.createElement('script');
            scriptEl.setAttribute('type', 'text/javascript')
            // 加载成功
            scriptEl.onload = scriptEl.onreadystateschange = function () {
                if (!this.readyState
                    || this.readyState == 'loaded' || this.readyState == 'complete') {
                    console.log('script loaded:' + opt.url);
                    if (opt.success) {
                        opt.success();
                    }
                }
            };
            // 加载失败
            scriptEl.onerror = function () {
                console.error('script loading failed:' + opt.url);
                if (opt.failure) {
                    opt.failure();
                }
            }
            scriptEl.src = url;
            document.body.appendChild(scriptEl);
        }
    },
    style: function (opt) {
        if (opt && opt.url) {
            if (opt.withAuthToken) {
                var token = PSR.util.Auth.getClientToken(function (token) {
                    PSR.util.Import.style(opt);
                });
                if (!token) {
                    return;
                }
                opt.params = Object.assign(
                    {},
                    opt.params,
                    {access_token: token.access_token}
                );
            }
            let url = opt.url;
            if (opt.params) {
                if (url.indexOf("?") == -1) {
                    url += "?";
                } else {
                    url += "&";
                }
                url += Ext.Object.toQueryString(opt.params)
            }
            // 导入脚本
            const scriptEl = document.createElement('link');
            scriptEl.setAttribute('rel', 'stylesheet');
            scriptEl.setAttribute('type', 'text/css')
            // 加载成功
            scriptEl.onload = scriptEl.onreadystateschange = function () {
                if (!this.readyState
                    || this.readyState == 'loaded' || this.readyState == 'complete') {
                    console.log('style loaded:' + opt.url);
                    if (opt.success) {
                        opt.success();
                    }
                }
            };
            // 加载失败
            scriptEl.onerror = function () {
                if (opt.failure) {
                    console.error('style loading failed:' + opt.url);
                    opt.failure();
                }
            }
            scriptEl.href = url;
            document.body.appendChild(scriptEl);
        }
    }
});