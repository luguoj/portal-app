Ext.define('PortalApp.view.entityConsole.EditorViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.entityconsole-editorviewcontroller',
    onAfterRendered: function (view) {
        const mode = view.getMode(),
            domainSchema = view.getDomainSchema(),
            form = view.down('form'),
            fields = [];
        for (let i = 0; i < domainSchema.length; i++) {
            const fieldSchema = domainSchema[i];
            const field = {
                name: fieldSchema.name,
                fieldLabel: fieldSchema.title,
                emptyText: fieldSchema.description
            };
            fields.push(field);
            if (mode == 'editing' && fieldSchema.name == 'id'
                || fieldSchema.name == 'version'
                || fieldSchema.name == 'createdDate'
                || fieldSchema.name == 'lastModifiedDate') {
                field.disabled = true;
            }
            switch (fieldSchema.type) {
                case 'java.math.BigDecimal':
                case 'java.lang.Integer':
                case 'java.lang.Long':
                    field.xtype = 'numberfield';
                    break;
                case 'java.time.LocalDateTime':
                    field.xtype = 'psr-datefield';
                    break;
                case 'boolean':
                case 'java.lang.Boolean':
                    field.xtype = 'psr-checkboxfield';
                    break;
                case 'java.lang.String':
                    field.xtype = 'textfield';
                    break;
                default:
                    PSR.util.Message.error('不支持的字段类型: ' + fieldSchema.title + '(' + fieldSchema.name + ')' + ' - ' + fieldSchema.type);

            }
        }
        form.add(fields);
        if (mode == 'editing') {
            this.loadEntity();
        }
    },
    loadEntity: function () {
        const view = this.getView(),
            application = view.getApplication(),
            domainType = view.getDomainType().get('type'),
            entityId = view.getEntityId(),
            form = view.down('form');
        if (entityId) {
            PSR.data.api.entity.EntityCRUDApi.findAllById({
                application: application,
                domainType: domainType,
                ids: [entityId],
                success: function (data) {
                    if (data && data.length > 0) {
                        form.loadRecord(Ext.data.Model.loadData(data[0]));
                    }
                }
            });
        }
    },
    onFrmDirtyChange: function (form, dirty) {
        const view = this.getView(),
            btnSave = view.down('button[handler=hBtnSave]');
        btnSave.setDisabled(!dirty);
    },
    hBtnReset: function () {
        this.loadEntity();
    },
    hBtnSave: function () {
        const view = this.getView(),
            application = view.getApplication(),
            domainType = view.getDomainType().get('type'),
            mode = view.getMode(),
            form = view.down('form'),
            idField = form.down('textfield[name=id]'),
            record = form.getRecord(),
            dirtyValues = form.getValues(false, true, true, false, true);
        if (mode == 'creating') {
            PSR.data.api.entity.EntityCRUDApi.create({
                application: application,
                domainType: domainType,
                values: dirtyValues,
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    form.loadRecord(Ext.data.Model.loadData(data));
                    view.setMode('editing');
                    idField.setDisabled(true);
                }
            });
        } else if (mode == 'editing') {
            const fields = [];
            for (const dirtyValuesKey in dirtyValues) {
                fields.push(dirtyValuesKey);
            }
            dirtyValues.id = record.get('id');
            dirtyValues.version = record.get('version');
            PSR.data.api.entity.EntityCRUDApi.patch({
                application: application,
                domainType: domainType,
                fields: fields,
                values: dirtyValues,
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    form.loadRecord(Ext.data.Model.loadData(data));
                }
            });
        }
    }
});
