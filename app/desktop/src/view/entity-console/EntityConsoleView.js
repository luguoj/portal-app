Ext.define('PortalApp.view.entityConsole.EntityConsoleView', {
    extend: 'Ext.panel.Panel',
    xtype: 'entityconsoleview',
    controller: 'entityconsoleviewcontroller',
    viewModel: 'entityconsoleviewmodel',
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
        selType: 'checkboxmodel',
        bbar: {
            xtype: 'psr-pagingtoolbar',
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
