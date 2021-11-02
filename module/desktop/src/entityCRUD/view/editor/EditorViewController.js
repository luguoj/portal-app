Ext.define('PSR.view.entityCRUD.data.EditorViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.psr-view-entitycrud-data-editorviewcontroller',
    onAfterRendered: function (view) {
        const form = view.down('form'),
            domainSchema = view.getDomainSchema(),
            entity = view.getEntity(),
            filterFields = [];
        for (let i = 0; i < domainSchema.length; i++) {
            const fieldSchema = domainSchema[i];
            const filterField = {
                name: fieldSchema.name,
                fieldLabel: fieldSchema.title,
                emptyText: fieldSchema.description
            };
            filterFields.push(filterField);
            if (entity && fieldSchema.name == 'id'
                || fieldSchema.name == 'version'
                || fieldSchema.name == 'createdDate'
                || fieldSchema.name == 'lastModifiedDate') {
                filterField.disabled = true;
            }
            switch (fieldSchema.type) {
                case 'java.math.BigDecimal':
                case 'java.lang.Integer':
                case 'java.lang.Long':
                    filterField.xtype = 'numberfield';
                    break;
                case 'java.time.LocalDateTime':
                    filterField.xtype = 'datefield';
                    filterField.format = 'Y-m-d H:i:s.u';
                    filterField.altFormats = 'Y-m-d\\TH:i:s.u';
                    break;
                case 'java.lang.Boolean':
                    filterField.xtype = 'checkboxfield';
                    break;
                case 'java.lang.String':
                    filterField.xtype = 'textfield';
                    break;
                default:
                    PSR.util.Message.error('不支持的字段类型: ' + fieldSchema.title + '(' + fieldSchema.name + ')' + ' - ' + fieldSchema.type);

            }
        }
        form.add(filterFields);
        if (entity) {
            form.loadRecord(entity);
        }
    },
    onFrmDirtyChange: function (form, dirty) {
        const view = this.getView(),
            btnReset = view.down('button[handler=hBtnReset]'),
            btnSave = view.down('button[handler=hBtnSave]');
        btnReset.setDisabled(!dirty);
        btnSave.setDisabled(!dirty);
    },
    hBtnReset: function () {
        const view = this.getView(), form = view.down('form');
        form.reset();
    }
});
