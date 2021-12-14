Ext.define('PortalApp.view.portalConsole.module.PropertyView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-module-editor-propertyview',
    config: {
        module: null
    },
    layout: 'fit',
    tools: [{
        iconCls: 'x-fa fa-redo-alt',
        handler: 'hBtnReset'
    }, {
        reference: 'btnSave',
        iconCls: 'x-fa fa-save',
        disabled: 'true',
        handler: 'hBtnSave',
        bind: {
            disabled: '{!dirty}'
        }
    }],
    items: [{
        reference: 'form',
        xtype: 'form',
        padding: 10,
        scrollable: 'y',
        trackResetOnLoad: true,
        defaults: {
            anchor: '100%'
        },
        items: [{
            name: 'id',
            xtype: 'textfield',
            fieldLabel: '主键标识符',
            emptyText: '主键标识符',
            bind: {
                disabled: '{mode=="editing"}'
            }
        }, {
            name: 'code',
            xtype: 'textfield',
            fieldLabel: '编码',
            emptyText: '编码',
            allowBlank: false
        }, {
            name: 'description',
            xtype: 'textfield',
            fieldLabel: '描述',
            emptyText: '描述',
            allowBlank: false
        }, {
            name: 'device',
            xtype: 'combobox',
            fieldLabel: '设备',
            emptyText: '设备',
            allowBlank: false,
            valueField: 'device',
            displayField: 'description',
            editable: false,
            queryMode: 'local',
            store: {
                fields: ['device', 'description'],
                data: [['desktop', '桌面'], ['phone', '手机']]
            },
        }, {
            name: 'enabled',
            xtype: 'checkboxfield',
            fieldLabel: '有效',
            emptyText: '有效',
            bind: {
                disabled: '{mode!="editing"}'
            }
        }],
        listeners: {
            dirtychange: 'onFrmDirtyChange'
        }
    }],
    updateModule: function (module) {
        const viewModel = this.getViewModel();
        viewModel.set('module', module);
        this.down('form').loadRecord(module);
        if (module) {
            viewModel.set('mode', 'editing');
        } else {
            viewModel.set('mode', 'creating');
        }
    },
    controller: 'portalconsole-module-editor-propertyviewcontroller',
    viewModel: {
        data: {
            module: null,
            mode: 'creating',
            dirty: false
        }
    }
});