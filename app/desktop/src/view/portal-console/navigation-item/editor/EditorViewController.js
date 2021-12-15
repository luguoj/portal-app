Ext.define('PortalApp.view.portalConsole.navigationItem.EditorViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-navigationitem-editorviewcontroller',
    onAfterRendered: function (view) {
        if (view.getNavigationItem()) {
            this.loadData();
        }
    },
    loadData: function () {
        const me = this,
            form = this.lookup('form'),
            viewModel = this.getViewModel(),
            navigationItem = viewModel.get('navigationItem'),
            moduleStore = this.getStore('modules');
        PortalApp.data.api.entity.EntityCRUDApi.findAllById({
            application: 'portal',
            domainType: 'org.psr.platform.portal.entity.NavigationItemEntity',
            ids: [navigationItem.get('id')],
            success: function (data) {
                if (data && data.length > 0) {
                    const newNavigationItem = Ext.data.Model.loadData(data[0]);
                    viewModel.set('navigationItem', newNavigationItem);
                    form.loadRecord(newNavigationItem);
                }
            }
        });
        PortalApp.data.api.entity.EntityCRUDApi.findAllById({
            application: 'portal',
            domainType: 'org.psr.platform.portal.entity.PortalEntity',
            ids: [navigationItem.get('portalId')],
            success: function (data) {
                if (data && data.length > 0) {
                    moduleStore.addFilter(
                        {
                            property: 'device',
                            operator: '==',
                            value: data[0].device
                        }, true);
                }
            }
        });
    },
    onFrmDirtyChange: function (form, dirty) {
        this.getViewModel().set('dirty', dirty);
    },
    hBtnCheck: function () {
        const txtViewConfig = this.lookup('form').down('field[name=viewConfig]');
        try {
            txtViewConfig.setValue(
                JSON.stringify(eval('(' + txtViewConfig.getValue() + ')'), null, 2)
            );
            PSR.util.Message.info('校验成功');
            return true;
        } catch (e) {
            PSR.util.Message.info('校验失败');
            return false;
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    hBtnSave: function () {
        if (!this.hBtnCheck()) {
            return;
        }
        const view = this.getView(),
            form = this.lookup('form'),
            record = form.getRecord(),
            dirtyValues = form.getValues(false, true, true, false, true);
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
            domainType: 'org.psr.platform.portal.entity.NavigationItemEntity',
            fields: fields,
            values: patchValues,
            success: function (data) {
                PSR.util.Message.info('保存成功');
                view.fireEvent('save', data);
            }
        });
    }
});
