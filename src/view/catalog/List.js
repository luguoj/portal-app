Ext.define('PSR.view.catalog.List', {
    extend: 'PSR.view.crud.List',
    xtype: 'psr-catalog-list',
    isTree: true,
    columns: [{
        xtype: 'psr-grid-column-treehref',
        text: '目录', width: 300,
        menuDisabled: true, sortable: false,
        cell: {
            handler: 'goDetails'
        },
        dataIndex: 'displaytext'
    }, {
        text: '用途', width: 85,
        menuDisabled: true, sortable: false,
        dataIndex: 'usage'
    }, {
        text: '路径', width: 300,
        menuDisabled: true, sortable: false,
        dataIndex: 'path'
    }],
    searchFields: [{
        xtype: 'combobox', placeholder: '用途', name: 'usage',
        queryMode: 'local',
        bind: {store: '{usageSelections}'}
    }, {
        xtype: 'textfield', placeholder: '路径', name: 'path'
    }],
    actions: {
        create: true,
        clone: false,
        delete: true
    },
    requireRefresh: function (opt) {
        return opt && opt.record;
    },
    viewModel: {
        stores: {
            entities: {
                type: 'catalogtree',
                autoLoad: true
            },
            usageSelections: {
                type: 'catalogusage'
            }
        }
    },
    controller: {
        getService: function () {
            return this.getView().up('psr-catalog').getService();
        }
    }
});
