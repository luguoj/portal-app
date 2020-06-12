Ext.define('PSR.panel.filterDataviewPicker.List', {
    extend: 'PSR.panel.filterDataviewPicker.Base',
    xtype: 'psr-panel-filterdataviewpicker-list',
    config: {
        displayField: 'text'
    },
    applyFilterDataView: function (filterDataView) {
        if (!filterDataView || !filterDataView.xtype) {
            return Object.assign({
                xtype: 'psr-dataview-filter-list',
                filterProperty: this.getDisplayField(),
                resultView: {
                    hideHeaders: true,
                    columns: [{
                        cell: {
                            encodeHtml: false,
                        },
                        text: 'Name',
                        dataIndex: this.getDisplayField(),
                        minWidth: 100,
                        flex: 1,
                        renderer: function (value, record) {
                            return '<b><u>' + value + '</u></b>';
                        }
                    }]
                }
            }, filterDataView);
        }
        return filterDataView;
    }
});
