Ext.define('PortalApp.view.console.authorization.data.DataView', {
    extend: 'Ext.panel.Panel',
    xtype: 'console-authorization-dataview',
    controller: 'console-authorization-dataviewcontroller',
    viewModel: 'console-authorization-dataviewmodel',
    tbar: {
        items: ['领域类型:', {
            xtype: 'combobox',
            editable: false,
            valueField: 'type',
            displayField: 'title',
            bind: {store: '{domainTypes}'},
            listeners: {
                change: 'onCombDomainTypeChange'
            }
        }, '-', {
            xtype: 'button',
            text: '创建',
            iconCls: 'x-fa fa-plus',
            bind: {disabled: '{!domainType}'},
            handler: 'hBtnAdd'
        }, {
            xtype: 'button',
            text: '删除',
            iconCls: 'x-fa fa-trash-alt',
            disabled: true,
            handler: 'hBtnRemove'
        }]
    },
    layout: 'fit',
    items: [{
        xtype: 'grid',
        columnLines: true,
        selType: 'checkboxmodel',
        bbar: {
            xtype: 'pagingtoolbar',
            displayInfo: true,
        },
        plugins: {
            gridfilters: true
        },
        bind: {store: '{entities}'},
        listeners: {
            itemdblclick: 'onGrdItemDbClick',
            selectionchange: 'onGrdSelectionChange'
        }
    }]
});
