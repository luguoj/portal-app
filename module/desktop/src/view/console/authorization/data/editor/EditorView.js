Ext.define('PortalApp.view.console.authorization.data.EditorView', {
    extend: 'Ext.panel.Panel',
    xtype: 'console-authorization-data-editorview',
    controller: 'console-authorization-data-editorviewcontroller',
    viewModel: 'console-authorization-data-editorviewmodel',
    config: {
        domainType: null,
        domainSchema: null,
        entity: null
    },
    constructor: function (config) {
        this.callParent([config]);
        const form = this.down('form'),
            domainSchema = this.getDomainSchema(),
            entity = this.getEntity(),
            filterFields = [];
        for (let i = 0; i < domainSchema.length; i++) {
            const fieldSchema = domainSchema[i];
            const filterField = {
                name: fieldSchema.name,
                fieldLabel: fieldSchema.title,
                emptyText: fieldSchema.description
            };
            filterFields.push(filterField);
            if (entity && (fieldSchema.name == 'id' || fieldSchema.name == 'version')) {
                filterField.xtype = 'textfield';
                filterField.editable = false;
                continue
            }
            switch (fieldSchema.type) {
                case 'java.lang.Integer':
                case 'java.lang.Long':
                    filterField.xtype = 'numberfield';
                    break;
                case 'java.math.BigDecimal':
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
    tbar: {
        items: [{
            xtype: 'button',
            iconCls: 'x-fa fa-save',
            handler: 'hBtnSave'
        }]
    },
    layout: 'fit',
    items: [{
        xtype: 'form',
        padding: 10,
        scrollable: 'y',
        defaults: {
            anchor: '100%'
        },
        items: []
    }]
});
