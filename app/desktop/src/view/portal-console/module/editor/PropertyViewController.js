Ext.define('PortalApp.view.portalConsole.module.PropertyViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-module-editor-propertyviewcontroller',
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
});