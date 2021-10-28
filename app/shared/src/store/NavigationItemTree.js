Ext.define('PortalApp.store.NavigationItemTree', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.portalapp-navigationitemtree',
    proxy: {
        type: 'psr-ajax',
        url: window.portalEnv.mainNavigationApi,
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
    }
});
