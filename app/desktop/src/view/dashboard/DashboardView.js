Ext.define('PortalApp.view.dashboard.DashboardView', {
    extend: 'Ext.panel.Panel',
    xtype: 'dashboardview',
    config: {
        editable: false,
        editing: false,
        mainPart: null
    },
    layout: {type: 'vbox', align: 'stretch'},
    scrollable: 'y',
    tbar: {
        items: [{
            iconCls: 'x-fa fa-redo-alt',
            tooltip: '刷新',
            handler: 'hBtnRefresh'
        }, {
            iconCls: 'x-fa fa-cog',
            tooltip: '配置',
            enableToggle: true,
            toggleHandler: 'hBtnEdit',
            bind: {
                hidden: '{!editable}',
                pressed: '{editable&&editing}'
            }
        }, {
            iconCls: 'x-fa fa-save',
            handler: 'hBtnSave',
            tooltip: '保存',
            bind: {
                hidden: '{!editing}'
            }
        }, {
            iconCls: 'x-fa fa-file-import',
            tooltip: '导入配置',
            handler: 'hBtnImport',
            bind: {
                hidden: '{!editing}'
            }
        }, {
            iconCls: 'x-fa fa-file-export',
            tooltip: '导出配置',
            handler: 'hBtnExport',
            bind: {
                hidden: '{!editing}'
            }
        }, '|', {
            iconCls: 'x-fa fa-retweet',
            tooltip: '转置',
            handler: 'hBtnTrans',
            bind: {
                hidden: '{!editing}'
            }
        }, {
            iconCls: 'x-fa fa-vector-square',
            tooltip: '自适应高度',
            handler: 'hBtnAutoHeight',
            bind: {
                hidden: '{!editing}'
            }
        }, {
            iconCls: 'x-fa fa-border-all',
            tooltip: '拆分模式',
            enableToggle: true,
            toggleHandler: 'hBtnSplitting',
            bind: {
                hidden: '{!editing}'
            }
        }],
        bind: {
            hidden: '{fullscreen}'
        }
    },
    updateEditable: function (value) {
        this.getViewModel().set('editable', value);
    },
    updateMainPart: function (value) {
        this.getController().loadData();
    },
    updateEditing: function (value) {
        this.getViewModel().set('editing', value);
        if (this.rendered) {
            this.down('dashboard-partview').setEditing(value);
        }
    },
    genTemplate: function () {
        return this.getController().genTemplate();
    },
    controller: 'dashboard-dashboardviewcontroller',
    viewModel: {
        data: {
            editable: true,
            editing: false,
            dashboardTemplateId: null
        }
    }
})
;
