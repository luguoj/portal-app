Ext.define('PSR.panel.searchDataviewPicker.Tree', {
    extend: 'PSR.panel.searchDataviewPicker.Base',
    xtype: 'psr-panel-searchdataviewpicker-tree',
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
    config: {
        displayField: 'text'
    },
    applySearchDataView: function (searchDataView) {
        if (!searchDataView || !searchDataView.xtype) {
            return Object.assign({
                xtype: 'psr-dataview-search-tree',
                resultView: {
                    hideHeaders: true,
                    columns: [{
                        xtype: 'treecolumn',
                        cell: {
                            encodeHtml: false,
                        },
                        text: 'Name',
                        dataIndex: this.getDisplayField(),
                        minWidth: 100,
                        flex: 1,
                        renderer: function (value, record) {
                            if (!record.data.isPath) {
                                return '<b><u>' + value + '</u></b>';
                            } else {
                                return value;
                            }
                        }
                    }]
                }
            }, searchDataView);
        }
        return searchDataView;
    }
});
