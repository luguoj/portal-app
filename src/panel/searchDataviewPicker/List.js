Ext.define('PSR.panel.searchDataviewPicker.List', {
    extend: 'PSR.panel.searchDataviewPicker.Base',
    xtype: 'psr-panel-searchdataviewpicker-list',
    config: {
        displayField: 'text'
    },
    applySearchDataView: function (searchDataView) {
        if (!searchDataView || !searchDataView.xtype) {
            return Object.assign({
                xtype: 'psr-dataview-search-list',
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
            }, searchDataView);
        }
        return searchDataView;
    }
});
