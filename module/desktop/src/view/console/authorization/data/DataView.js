Ext.define('PortalApp.view.console.authorization.data.DataView', {
    extend: 'Ext.panel.Panel',
    xtype: 'console-authorization-dataview',
    controller: 'console-authorization-dataviewcontroller',
    viewModel: 'console-authorization-dataviewmodel',
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
        },
        plugins: {
            gridfilters: true
        },
        bind: {store: '{entities}'}
    }]
});
