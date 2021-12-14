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
            xtype: 'psr-checkboxfield',
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
    controller: {
        onFrmDirtyChange: function (form, dirty) {
            this.getViewModel().set('dirty', dirty);
        },
        hBtnSave: function () {
            const view = this.getView(),
                form = this.lookup('form'),
                record = form.getRecord(),
                dirtyValues = form.getValues(false, true, true, false, true),
                mode = this.getViewModel().get('mode');
            if (mode == 'creating') {
                PortalApp.data.api.portal.ModuleApi.create({
                    values: dirtyValues,
                    success: function (data) {
                        PSR.util.Message.info('保存成功');
                        view.fireEvent('save', data);
                    }
                });
            } else if (mode == 'editing') {
                const fields = [];
                for (let dirtyValuesKey in dirtyValues) {
                    fields.push(dirtyValuesKey);
                }
                const patchValues = Object.assign(
                    {id: record.get('id'), version: record.get('version')},
                    dirtyValues
                );
                PortalApp.data.api.entity.EntityCRUDApi.patch({
                    application: 'portal',
                    domainType: 'org.psr.platform.portal.entity.ModuleEntity',
                    fields: fields,
                    values: patchValues,
                    success: function (data) {
                        PSR.util.Message.info('保存成功');
                        view.fireEvent('save', data);
                    }
                });
            }
        },
        hBtnReset: function () {
            this.getView().down('form').reset();
            this.getView().fireEvent('reset');
        }
    },
    viewModel: {
        data: {
            module: null,
            mode: 'creating',
            dirty: false
        }
    }
});