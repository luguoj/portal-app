Ext.define('PSR.panel.crud.search.List', {
    extend: 'PSR.panel.crud.search.Base',
    xtype: 'psr-panel-crud-search-list',
    applySearchDataView: function (searchDataView) {
        var displayFieldColumn = {
            xtype: 'psr-grid-column-href',
            dataIndex: this.getDisplayField(),
            text: this.getDisplayFieldHeader(),
            width: 300,
            cell: {
                scope: this.getController(),
                handler: 'goDetails'
            }
        };
        if (!searchDataView || !searchDataView.xtype) {
            searchDataView = Object.assign({
                xtype: 'psr-dataview-search-list'
            }, searchDataView);
        }
        if (searchDataView.resultView) {
            if (searchDataView.resultView.columns) {
                searchDataView.resultView.columns = [displayFieldColumn].concat(searchDataView.resultView.columns);
            } else {
                searchDataView.resultView.columns = [displayFieldColumn]
            }
        }
        return searchDataView;
    },
});
