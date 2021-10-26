Ext.define('PortalApp.store.NavigationItemTree', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.portalapp-navigationitemtree',
    proxy: {
        type: 'psr-clientsite-ajax',
        url: window.gatewaySite + '/extapp/api/desktop/navigation_item',
        reader: {
            transform: function (data) {
                if (data && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var record = data[i];
                        if (record.viewConfig) {
                            if (!record.iconCls) {
                                record.iconCls = 'x-fa fa-cube'
                            }
                            try {
                                record.viewConfig = JSON.parse(record.viewConfig);
                            } catch (e) {
                                console.error(e);
                            }
                        }else{
                            if (!record.iconCls) {
                                record.iconCls = 'x-fa fa-cubes'
                            }
                        }
                    }
                }
                return PSR.data.reader.Transform.parentTree(data);
            }
        }
    }
});
