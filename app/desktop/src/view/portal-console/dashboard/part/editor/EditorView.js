Ext.define('PortalApp.view.portalConsole.dashboard.part.EditorView', {
    extend: 'Ext.window.Window',
    xtype: 'portalconsole-dashboard-part-editorview',
    config: {
        partCode: null,
        partConfigValue: null
    },
    constrain: true,
    width: '25%',
    height: '50%',
    layout: 'fit',
    bodyPadding: 10,
    tools: [{
        iconCls: 'x-fa fa-clipboard-check',
        tooltip: '校验',
        handler: 'hBtnCheck',
        bind: {
            disabled: '{!dirty}'
        }
    }, {
        iconCls: 'x-fa fa-save',
        tooltip: '保存',
        handler: 'hBtnSave',
        bind: {
            disabled: '{!dirty}'
        }
    }, {
        iconCls: 'x-fa fa-redo-alt',
        tooltip: '还原',
        handler: 'hBtnRefresh'
    }],
    items: [{
        xtype: 'form',
        reference: 'form',
        padding: 10,
        trackResetOnLoad: true,
        defaults: {
            anchor: '100%'
        },
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'textareafield',
            name: 'configValue',
            flex: 1
        }],
        listeners: {
            dirtychange: 'onFrmDirtyChange'
        }
    }],
    bind: {
        title: '部件配置 {partCode}'
    },
    updatePartCode: function (value) {
        this.getViewModel().set('partCode', value);
    },
    updatePartConfigValue: function () {
        this.getController().loadData();
    },
    controller: 'portalconsole-dashboard-part-editorviewcontroller',
    viewModel: {
        data: {
            partCode: '',
            dirty: false
        }
    }
});
