Ext.define('PortalApp.view.portalConsole.dashboardTemplate.EditorView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-dashboardtemplate-editorview',
    config: {
        dashboardTemplate: null
    },
    layout: {type: 'vbox', align: 'stretch'},
    scrollable: 'y',
    tbar: {
        items: [{
            iconCls: 'x-fa fa-redo-alt',
            handler: 'hBtnRefresh'
        }, {
            iconCls: 'x-fa fa-save',
            handler: 'hBtnSave'
        }, {
            iconCls: 'x-fa fa-file-import',
            tooltip: '导入配置',
            handler: 'hBtnImport'
        }, {
            iconCls: 'x-fa fa-file-export',
            tooltip: '导出配置',
            handler: 'hBtnExport'
        }, '|', {
            iconCls: 'x-fa fa-vector-square',
            tooltip: '自适应高度',
            handler: 'hBtnAutoHeight'
        }],
        bind: {
            hidden: '{fullscreen}'
        }
    },
    items: [],
    updateDashboardTemplate: function (value) {
        this.getViewModel().set('dashboardTemplate', value);
        this.getController().loadData();
    },
    controller: 'portalconsole-dashboardtemplate-editorviewcontroller',
    viewModel: {
        data: {
            dashboardTemplate: null
        },
        stores: {}
    }
});