Ext.define('PSR.view.catalog.List', {
    extend: 'PSR.view.crud.List',
    xtype: 'psr-catalog-list',
    isTree: true,
    columns: [{
        xtype: 'psr-grid-column-treehref',
        text: '目录', width: 300,
        menuDisabled: true, sortable: false,
        cell: {
            encodeHtml: false,
            handler: 'goDetails'
        },
        dataIndex: 'displaytext',
        renderer: 'filterRenderer'
    }, {
        text: '用途', width: 85,
        menuDisabled: true, sortable: false,
        dataIndex: 'usage'
    }, {
        text: '路径', width: 300,
        menuDisabled: true, sortable: false,
        dataIndex: 'path'
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
                filterer: 'bottomup'
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
