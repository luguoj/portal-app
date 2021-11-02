Ext.define('PSR.view.entityCRUD.data.DataView', {
    extend: 'Ext.panel.Panel',
    xtype: 'psr-view-entitycrud-dataview',
    controller: 'psr-entitycrud-dataviewcontroller',
    viewModel: 'psr-entitycrud-dataviewmodel',
    config: {
        application: '',
    },
    updateApplication: function () {
        const application = this.getApplication(),
            controller = this.getController(),
            viewModel = this.getViewModel();
        if (controller) {
            controller.setApplication(application);
        }
        if (viewModel) {
            viewModel.setApplication(application);
        }
    },
    constructor: function (config) {
        this.callParent([config]);
        this.updateApplication();
    },
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
