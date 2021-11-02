Ext.define('PortalApp.view.console.authorization.data.EditorView', {
    extend: 'Ext.panel.Panel',
    xtype: 'console-authorization-data-editorview',
    controller: 'console-authorization-data-editorviewcontroller',
    viewModel: 'console-authorization-data-editorviewmodel',
    config: {
        domainType: null,
        domainSchema: null,
        entity: null
    },
    tbar: {
        items: [{
            xtype: 'button',
            text: '重置',
            iconCls: 'x-fa fa-redo-alt',
            disabled: 'true',
            handler: 'hBtnReset'
        }, {
            xtype: 'button',
            text: '保存',
            iconCls: 'x-fa fa-save',
            disabled: 'true',
            handler: 'hBtnSave'
        }]
    },
    layout: 'fit',
    items: [{
        xtype: 'form',
        padding: 10,
        scrollable: 'y',
        trackResetOnLoad: true,
        defaults: {
            anchor: '100%'
        },
        items: [],
        listeners: {
            dirtychange: 'onFrmDirtyChange'
        }
    }],
    listeners: {
        afterrender: 'onAfterRendered'
    }
});
