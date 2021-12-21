Ext.define('PortalApp.view.main.MainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.mainviewmodel',
    data: {
        appTitle: '',
        personnel_description: '123'
    },
    formulas: {},
    stores: {
        navNodes: {
            type: 'tree',
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: 'content',
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
        }
    }
});
