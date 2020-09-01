Ext.define('PSR.clientSite.ClientSite', {
    alternateClassName: ['PSR.ClientSite'],
    singleton: true,
    clientTokenEndpoint: window.clientSite + '/token',
    constructor: function (config) {
        this.callParent([config]);
        window.addEventListener("message", function (event) {
            if (event.origin === window.clientSite) {
                if (event.data === 'login_success') {
                    console.log('login message got')
                    if (PSR.ClientSite.oauth2LoginDialog) {
                        PSR.ClientSite.oauth2LoginDialog.close();
                    }
                    PSR.ClientSite.getAuthorizationHeader();
                    if (PSR.ClientSite.loginSuccess) {
                        PSR.ClientSite.loginSuccess();
                        delete PSR.ClientSite.loginSuccess;
                    }
                } else if (event.data === 'login_retry') {
                    console.log('login retry message got')
                    if (PSR.ClientSite.oauth2LoginDialog) {
                        PSR.ClientSite.oauth2LoginDialog.getAt(0).updateSrc(window.clientSite);
                    }
                } else if (event.data === 'logout_success') {
                    console.log('logout message got')
                    location.reload();
                }
            }
        }, false);
    },
    login: function (loginSuccess) {
        PSR.ClientSite.loginSuccess = loginSuccess;
        PSR.ClientSite.oauth2LoginDialog =
            Ext.create({
                xtype: 'dialog',
                title: '登陆中...',
                iconCls: 'x-fa fa-spinner fa-spin',
                maximized: true,
                resizable: false, layout: 'fit', bodyPadding: 0, items: {
                    xtype: 'psr-iframe'
                },
                listeners: {
                    show: function (dialog) {
                        dialog.getAt(0).setSrc(window.clientSite);
                    }
                }
            });
        PSR.ClientSite.oauth2LoginDialog.show();
    },
    logout: function () {
        Ext.create({
            xtype: 'dialog',
            title: '登出',
            iconCls: 'x-fa fa-spinner fa-spin',
            closable: true,
            resizable: false,
            html: '<iframe  src="' + window.clientSite + '/logout" frameborder="0" width="0px" height="0px"></iframe > ',
        }).show();
    },
    getClientToken: function (callback) {
        const now = (new Date()).getTime();
        if (PSR.ClientSite.clientToken && (!PSR.ClientSite.clientToken.expires_at || PSR.ClientSite.clientToken.expires_at > now)) {
            return PSR.ClientSite.clientToken;
        } else {
            Ext.Ajax.request({
                method: 'POST',
                url: PSR.ClientSite.clientTokenEndpoint,
                withCredentials: true,
                success: function (response) {
                    try {
                        var respObj = JSON.parse(response.responseText);
                        if (respObj.access_token) {
                            PSR.ClientSite.clientToken = respObj;
                            PSR.ClientSite.clientToken.authHeader = {Authorization: respObj.token_type + ' ' + respObj.access_token};
                            if (respObj.expires_in) {
                                PSR.ClientSite.clientToken.expires_at = now + respObj.expires_in * 1000;
                            } else {
                                delete PSR.ClientSite.clientToken.expires_at;
                            }
                            if (callback) {
                                callback(PSR.ClientSite.clientToken);
                            }
                        } else if (respObj.success && respObj.result && respObj.result.access_token) {
                            PSR.ClientSite.clientToken = respObj.result;
                            PSR.ClientSite.clientToken.authHeader = {Authorization: respObj.result.token_type + ' ' + respObj.result.access_token};
                            if (respObj.result.expires_in) {
                                PSR.ClientSite.clientToken.expires_at = now + respObj.result.expires_in * 1000;
                            } else {
                                delete PSR.ClientSite.clientToken.expires_at;
                            }
                            if (callback) {
                                callback(PSR.ClientSite.clientToken);
                            }
                        } else {
                            console.log(respObj);
                        }
                    } catch (err) {
                        PSR.Message.error(err.message);
                        console.error(err);
                    }
                },
                failure: function (response) {
                    if (response) {
                        if (response.status == '401') {
                            PSR.Message.error("授权信息无效，请重新登陆",function(){
                                PSR.clientSite.ClientSite.login(function () {
                                    PSR.clientSite.ClientSite.getClientToken(callback);
                                });
                            });
                            return;
                        }
                    }
                    PSR.Message.error("授权信息无效");
                }
            });
            return false;
        }
    },
    getAuthorizationHeader: function (callback) {
        var token = PSR.ClientSite.getClientToken(function (_token) {
            if (callback) {
                callback(_token.authHeader);
            }
        });
        return token ? token.authHeader : false;
    },
    getModuleAction: function (moduleId, callback) {
        const me = this;
        if (!me.extModuleAction) {
            me.extModuleAction = {};
        }
        if (!me.extModuleAction[moduleId]) {
            me.extModuleAction[moduleId] = {loading: true};
            PSR.clientSite.service.ClientSite.loadModuleAction({
                moduleId: moduleId,
                success: function (data) {
                    const actions = {};
                    if (data && data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            actions[data[i].code] = true;
                        }
                    }
                    me.extModuleAction[moduleId] = actions;
                    me.getModuleAction(moduleId, callback);
                },
                complete: function () {
                    if (me.extModuleAction[moduleId].loading) {
                        delete me.extModuleAction[moduleId].loading;
                    }
                }
            })
        } else {
            const moduleAction = me.extModuleAction[moduleId];
            if (moduleAction.loading == true) {
                window.setTimeout(function () {
                    me.getModuleAction(moduleId, callback);
                }, 500);
            } else if (callback) {
                callback(moduleAction);
            }
        }
    },
    getModuleReady: function (moduleId, callback) {
        const me = this;
        if (!me.extModuleReady) {
            me.extModuleReady = {};
        }
        if (!me.extModuleReady[moduleId]) {
            me.extModuleReady[moduleId] = {loading: true};
            PSR.clientSite.service.ClientSite.loadModuleSrc({
                moduleId: moduleId,
                success: function () {
                    me.extModuleReady[moduleId] = true;
                    me.getModuleReady(moduleId, callback);
                },
                complete: function () {
                    if (me.extModuleReady[moduleId].loading) {
                        delete me.extModuleReady[moduleId];
                    }
                }
            });
        } else {
            const moduleReady = me.extModuleReady[moduleId];
            if (moduleReady.loading == true) {
                window.setTimeout(function () {
                    me.getModuleReady(moduleId, callback);
                }, 500);
            } else {
                me.getModuleAction(moduleId, callback);
            }
        }
    },
    addModuleItem: function (moduleId, config, parent, callback) {
        if (moduleId) {
            PSR.clientSite.ClientSite.getModuleReady(moduleId, function (actions) {
                const item = parent.add(Object.assign({}, config, {actions: actions}));
                if (callback) {
                    callback(item);
                }
            });
        } else {
            const item = parent.add(config)
            if (callback) {
                callback(item);
            }
        }
    }
});
