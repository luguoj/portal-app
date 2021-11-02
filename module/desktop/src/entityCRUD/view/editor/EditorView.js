Ext.define('PSR.view.entityCRUD.data.EditorView', {
    extend: 'Ext.panel.Panel',
    xtype: 'psr-view-entitycrud-data-editorview',
    controller: 'psr-view-entitycrud-data-editorviewcontroller',
    viewModel: 'psr-view-entitycrud-data-editorviewmodel',
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
