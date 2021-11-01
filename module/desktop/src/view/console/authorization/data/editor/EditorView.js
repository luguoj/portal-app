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
            iconCls: 'x-fa fa-save',
            handler: 'hBtnSave'
        }]
    },
    layout: 'fit',
    items: [{
        xtype: 'form',
        padding: 10,
        scrollable: 'y',
        defaults: {
            anchor: '100%'
        },
        items: []
    }],
    listeners:{
        afterrender:'onAfterRendered'
    }
});
