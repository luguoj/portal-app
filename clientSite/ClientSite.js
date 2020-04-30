Ext.define('PSR.clientSite.ClientSite', {
    alternateClassName: ['PSR.ClientSite'],
    singleton: true,
    clientTokenEndpoint: window.clientSite + '/token',
    login: function (loginSuccess) {
        window.addEventListener("message", function (event) {
            if (event.origin === window.clientSite) {
                if (event.data === 'login_success') {
                    console.log('login message got')
                    PSR.ClientSite.loginSuccess = true;
                    if (PSR.ClientSite.oauth2LoginDialog) {
                        PSR.ClientSite.oauth2LoginDialog.hide();
                    }
                    if (loginSuccess) {
                        PSR.ClientSite.getAuthorizationHeader();
                        loginSuccess();
                    }
                }else if(event.data === 'logout_success'){
                    console.log('logout message got')
                    location.reload();
                }
            }
        }, false);
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
    getAuthorizationHeader: function (callback) {
        if (PSR.ClientSite.clientToken) {
            return PSR.ClientSite.clientToken.authHeader;
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
                            if (callback) {
                                callback(PSR.ClientSite.clientToken.authHeader);
                            }
                        } else {
                            console.log(respObj);
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
            });
            return false;
        }
    }
});
