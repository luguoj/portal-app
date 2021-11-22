Ext.define('PortalApp.store.NavigationItemTree', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.portalapp-navigationitemtree',
    proxy: {
        type: 'psr-ajax',
        withAuthToken: true,
        reader: {
            transform: function (data) {
                if (data && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var record = data[i];
                        if (record.viewConfig && typeof (record.viewConfig) == 'string') {
                            if (!record.iconCls) {
                                record.iconCls = 'x-fa fa-cube'
                            }
                            try {
                                record.viewConfig = JSON.parse(record.viewConfig);
                            } catch (e) {
                                console.error(e);
                            }
                        }
                        if (!record.iconCls) {
                            record.iconCls = 'x-fa fa-cubes'
                        }
                    }
                }
                return PSR.data.reader.Transform.parentTree(data);
            }
        }
    },
    load: function (opt) {
        const me = this;
        var token = PSR.util.Auth.getClientToken(function (token) {
            me.load(opt);
        });
        if (token) {
            if (token.username == 'platform_admin') {
                this.getProxy().setUrl('resources/' + window.portalEnv.profile + '/navigation_item/platform_admin.json');
            } else if (window.portalEnv.develop) {
                this.getProxy().setUrl('resources/' + window.portalEnv.profile + '/navigation_item/developer.json');
            } else {
                this.getProxy().setUrl(window.portalEnv.gateway + '/extapp/api/' + window.portalEnv.profile + '/navigation_item');
            }
            this.callParent([opt]);
        }
    }
});
