Ext.define('PortalApp.view.console.auth.data.DataView', {
    extend: 'Ext.panel.Panel',
    xtype: 'console-auth-dataview',
    controller: 'console-auth-dataviewcontroller',
    viewModel: 'console-auth-dataviewmodel',
    tbar: {
        items: [{
            xtype: 'combobox',
            editable: false,
            valueField: 'type',
            displayField: 'title',
            bind: {store: '{domainTypes}'},
            listeners: {
                change: 'hCombDomainTypeChange'
            }
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-filter',
            enableToggle: true,
            listeners: {
                toggle: 'hBtnFilterToggle'
            }
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-search',
            handler: 'hBtnSearch'
        }]
    },
    layout: 'border',
    defaults: {
        split: true,
        bodyPadding: 10
    },
    items: [{
        region: 'west',
        width: '20%',
        hidden: true,
        xtype: 'form',
        scrollable: 'y',
        defaults: {
            anchor: '100%'
        },
        items: []
    }, {
        region: 'center',
        xtype: 'grid',
        bbar: {
            xtype: 'pagingtoolbar',
            displayInfo: true,
            displayMsg: '第 {0} - {1} 行, 共{2}行记录',
            emptyMsg: "没有记录"
        },
        bind: {store: '{entities}'}
    }]
});
