Ext.define('PSR.panel.crud.search.Tree', {
    extend: 'PSR.panel.crud.search.Base',
    xtype: 'psr-panel-crud-search-tree',
    controller: {
        beforeSelect: function (grid, selected) {
            var _selected = [], deselect = [];
            if (selected) {
                for (var i = 0; i < selected.length; i++) {
                    if (!selected[i].data.isPath) {
                        _selected.push(selected[i]);
                    } else {
                        deselect.push(selected[i]);
                    }
                }
            }
            grid.getSelectable().deselect(deselect);
            return _selected;
        }
    },
    applySearchDataView: function (searchDataView) {
        var displayFieldColumn = {
            xtype: 'psr-grid-column-treehref',
            dataIndex: this.getDisplayField(),
            text: this.getDisplayFieldHeader(),
            width: 300,
            cell:{
                scope: this.getController(),
                handler: 'goDetails'
            }
        };
        if (!searchDataView || !searchDataView.xtype) {
            searchDataView = Object.assign({
                xtype: 'psr-dataview-search-tree'
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
    }
});
