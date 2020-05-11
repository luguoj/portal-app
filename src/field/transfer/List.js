Ext.define('PSR.field.transfer.List', {
    extend: 'PSR.field.transfer.Base',
    xtype: 'psr-field-transfer-list',
    createDataviewCfg: function (dataview) {
        if (!dataview || !dataview.xtype) {
            return Object.assign({
                xtype: 'grid',
                hideHeaders: true,
                selectable: {
                    mode:'multi'
                },
                columns: [{
                    flex: 1,
                    dataIndex: this.getDisplayField(),
                    minWidth: 100
                }],
                store: {data: []}
            }, dataview);
        }
        return dataview;
    },
    applySelectedDataview: function (selectedDataview) {
        return this.createDataviewCfg(selectedDataview);
    },
    applyUnselectedDataview: function (unselectedDataview) {
        return this.createDataviewCfg(unselectedDataview);
    }
});
