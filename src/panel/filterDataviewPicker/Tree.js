Ext.define('PSR.panel.filterDataviewPicker.Tree', {
    extend: 'PSR.panel.filterDataviewPicker.Base',
    xtype: 'psr-panel-filterdataviewpicker-tree',
    controller: {
        beforeSelect: function (grid, selected) {
            var _selected = [], deselect = [];
            if (selected) {
                for (var i = 0; i < selected.length; i++) {
                    if (selected[i].data.isRecord) {
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
    applyFilterDataView: function (filterDataView) {
        if (!filterDataView || !filterDataView.xtype) {
            return Object.assign({
                xtype: 'psr-dataview-filter-tree',
                filterProperty: this.getDisplayField(),
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
                            if (record.data.isRecord) {
                                return '<b><u>' + value + '</u></b>';
                            } else {
                                return value;
                            }
                        }
                    }]
                }
            }, filterDataView);
        }
        return filterDataView;
    }
});
