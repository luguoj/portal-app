Ext.define('PSR.data.AjaxStore', {
    extend: 'Ext.data.Store',
    alias: 'store.psr-ajax-store',
    config: {
        withAuthToken: false
    },
    proxy: {
        type: 'psr-ajax'
    },
    flushLoad: function () {
        const store = this,
            proxy = store.getProxy(),
            withAuthToken = store.getWithAuthToken();
        if (withAuthToken) {
            const authHeader = PSR.util.Auth.getAuthorizationHeader(function (authHeader) {
                store.flushLoad();
            });
            if (!authHeader) {
                return;
            }
            proxy.setHeaders(Object.assign({}, proxy.getHeaders(), authHeader));
        }
        store.callParent();
    },
    listeners: {
        load: function (store, records, successful, operations, opt) {
            if (!successful) {
                if (operations.error && operations.error.status == 401) {
                    if (store.getWithAuthToken()) {
                        PSR.util.Auth.clientToken.expires_at = 1;
                        if (!opt.retryTimes || opt.retryTimes < 10) {
                            opt.retryTimes = opt.retryTimes ? opt.retryTimes + 1 : 1;
                            opt.retryMessage = opt.retryMessage || Ext.Msg.show({
                                title: '授权异常,重试中...',
                                progress: true,
                                closable: false
                            });
                            setTimeout(function () {
                                opt.retryMessage.updateProgress(0.1 * opt.retryTimes);
                                store.reload();
                            }, 200);
                            return;
                        }
                    }
                    PSR.data.Ajax.onErrorMessage('授权信息无效', opt);
                }
            }
            if (opt.retryTimes) {
                delete opt.retryTimes;
            }
            if (opt.retryMessage) {
                opt.retryMessage.close();
                delete opt.retryMessage;
            }
        }
    }
});