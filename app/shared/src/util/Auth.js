Ext.define('PSR.util.Auth', {
    singleton: true,
    clientTokenEndpoint: window.portalEnv.authclient + '/api/token',
    constructor: function (config) {
        this.callParent([config]);
        window.addEventListener("message", function (event) {
            if (event.data === 'login_success') {
                console.log('login message got')
                if (PSR.util.Auth.oauth2LoginDialog) {
                    PSR.util.Auth.oauth2LoginDialog.destroy();
                    delete PSR.util.Auth.oauth2LoginDialog;
                }
                if (PSR.util.Auth.loginSuccess) {
                    PSR.util.Auth.loginSuccess();
                    delete PSR.util.Auth.loginSuccess;
                }
            } else if (event.data === 'login_retry') {
                console.log('login retry message got')
                if (PSR.util.Auth.oauth2LoginDialog) {
                    PSR.util.Auth.oauth2LoginDialog.getAt(0).updateSrc(window.portalEnv.authclient);
                }
            } else if (event.data === 'logout_success') {
                console.log('logout message got')
                location.reload();
            }
        }, false);
    },
    login: function (loginSuccess) {
        PSR.util.Auth.loginSuccess = loginSuccess;
        PSR.util.Auth.oauth2LoginDialog =
            Ext.create({
                xtype: 'psr-iframe',
                src: window.portalEnv.authclient,
                floating: true,
                floated: true,
                height: '100%',
                width: '100%',
                style: {
                    'background-image': 'none',
                    'background-color': 'rgba(0, 0, 0, 0.75)'
                }
            });
        PSR.util.Auth.oauth2LoginDialog.show();
    },
    logout: function () {
        Ext.toast({
            title: "登出",
            html: '登出<iframe  src="' + window.portalEnv.authclient + '/logout" frameborder="0" width="0px" height="0px"></iframe > ',
        });
    },
    checkUserChange: function (newToken) {
        if (PSR.util.Auth.clientToken && PSR.util.Auth.clientToken.userId && PSR.util.Auth.clientToken.userId != newToken.userId) {
            PSR.util.Message.error('用户已变更，即将重置工作台。', function () {
                window.location.reload();
            });
        }
    },
    getClientToken: function (callback) {
        const now = (new Date()).getTime();
        if (PSR.util.Auth.clientToken && (!PSR.util.Auth.clientToken.expires_at || PSR.util.Auth.clientToken.expires_at > now)) {
            return PSR.util.Auth.clientToken;
        } else {
            Ext.Ajax.request({
                method: 'GET',
                url: PSR.util.Auth.clientTokenEndpoint,
                withCredentials: true,
                success: function (response) {
                    try {
                        var respObj = JSON.parse(response.responseText);
                        if (respObj.access_token) {
                            PSR.util.Auth.checkUserChange(respObj);
                            PSR.util.Auth.clientToken = respObj;
                            PSR.util.Auth.clientToken.authHeader = {Authorization: respObj.token_type.value + ' ' + respObj.access_token};
                            if (respObj.expires_in) {
                                PSR.util.Auth.clientToken.expires_at = now + respObj.expires_in * 1000;
                            } else if (respObj.expires_at) {
                                PSR.util.Auth.clientToken.expires_at = respObj.expires_at;
                            } else {
                                delete PSR.util.Auth.clientToken.expires_at;
                            }
                            if (callback) {
                                callback(PSR.util.Auth.clientToken);
                            }
                        } else {
                            console.log(respObj);
                            PSR.util.Message.error("认证失效，请重新登陆", function () {
                                PSR.util.Auth.login(function () {
                                    PSR.util.Auth.getClientToken(callback);
                                });
                            });
                        }
                    } catch (err) {
                        console.log(err);
                        PSR.util.Message.error("认证失效，请重新登陆", function () {
                            PSR.util.Auth.login(function () {
                                PSR.util.Auth.getClientToken(callback);
                            });
                        });
                    }
                },
                failure: function (response) {
                    if (response) {
                        if (response.status == '401') {
                            PSR.util.Message.error("授权信息无效，请重新登陆", function () {
                                PSR.util.Auth.login(function () {
                                    PSR.util.Auth.getClientToken(callback);
                                });
                            });
                            return;
                        }
                    }
                    PSR.util.Message.error("授权信息无效，请重新登陆", function () {
                        PSR.util.Auth.login(function () {
                            PSR.util.Auth.getClientToken(callback);
                        });
                    });
                }
            });
            return false;
        }
    },
    getAuthorizationHeader: function (callback) {
        var token = PSR.util.Auth.getClientToken(function (_token) {
            if (callback) {
                callback(_token.authHeader);
            }
        });
        return token ? token.authHeader : false;
    }
});
