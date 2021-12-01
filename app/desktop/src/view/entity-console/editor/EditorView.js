Ext.define('PortalApp.view.entityConsole.EditorView', {
    extend: 'Ext.panel.Panel',
    xtype: 'entityconsole-editorview',
    controller: 'entityconsole-editorviewcontroller',
    viewModel: 'entityconsole-editorviewmodel',
    config: {
        application: '',
        mode: '',
        domainType: null,
        domainSchema: null,
        entityId: null
    },
    tbar: {
        items: [{
            xtype: 'button',
            text: '重置',
            iconCls: 'x-fa fa-redo-alt',
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
