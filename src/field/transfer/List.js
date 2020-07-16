Ext.define('PSR.field.transfer.List', {
    extend: 'PSR.field.transfer.Base',
    xtype: 'psr-field-transfer-list',
    createDataviewCfg: function (dataview, header) {
        if (!dataview || !dataview.xtype) {
            return Object.assign({
                xtype: 'grid',
                selectable: {
                    mode: 'multi'
                },
                columns: [{
                    text: header, sortable: false, menuDisabled: true,
                    flex: 1,
                    dataIndex: this.getDisplayField(),
                    minWidth: 100
                }],
                store: {
                    data: [],
                    sorters: [{
                        property: this.getSortField()
                    }]
                }
            }, dataview);
        }
        return dataview;
    },
    applySelectedDataview: function (selectedDataview) {
        return this.createDataviewCfg(selectedDataview, '已选项');
    },
    applyUnselectedDataview: function (unselectedDataview) {
        return this.createDataviewCfg(unselectedDataview, '待选项');
    }
});
