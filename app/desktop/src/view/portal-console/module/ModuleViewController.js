Ext.define('PortalApp.view.portalConsole.ModuleViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-moduleviewcontroller',
    onGrdItemDbClick: function (grid, record, item, index) {
        const view = this.getView();
        view.fireEvent('switchview', {
            viewId: 'portalconsole-module-editorview-' + record.get('id'),
            title: '模块',
            iconCls: 'x-fa fa-edit',
            viewConfig: {
                xtype: 'portalconsole-module-editorview',
                module: record
            },
        })
    },
    onGrdSelectionChange: function (sm, selections) {
        const view = this.getView(),
            btnRemove = view.down('button[handler=hBtnRemove]');
        if (selections.length) {
            btnRemove.enable();
        } else {
            btnRemove.disable();
        }
    },
    hBtnAdd: function (btn) {
        const view = this.getView(),
            viewModel = this.getViewModel();
        view.fireEvent('switchview', {
            viewId: 'portalconsole-module-editorview-' + Date.parse(new Date()),
            iconCls: 'x-fa fa-edit',
            viewConfig: {
                xtype: 'portalconsole-module-editorview'
            },
        })
    },
    hBtnEnabled: function (btn) {
        const me = this,
            record = btn.lookupViewModel().get('record'),
            fields = ['enabled'],
            values = {
                id: record.get('id'),
                version: record.get('version'),
                enabled: !record.get('enabled')
            };
        PortalApp.data.api.entity.EntityCRUDApi.patch({
            application: 'portal',
            domainType: 'org.psr.platform.portal.entity.ModuleEntity',
            fields: fields,
            values: values,
            success: function (data) {
                PSR.util.Message.info('保存成功');
                me.getStore('modules').reload();
            }
        });
    },
    hBtnRemove: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            record = grid.getStore().getAt(rowIndex);
        PSR.util.Message.confirm('删除模块:' + record.get('description'), function () {
            view.mask('处理中...');
            PortalApp.data.api.portal.ModuleApi.delete({
                id: record.get('id'),
                success: function () {
                    me.getStore('modules').reload();
                    PSR.util.Message.info('删除成功');
                },
                complete:function (){
                    view.unmask();
                }
            });
        });
    }
});
