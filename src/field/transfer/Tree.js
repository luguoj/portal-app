Ext.define('PSR.field.transfer.Tree', {
    extend: 'PSR.field.transfer.Base',
    xtype: 'psr-field-transfer-tree',
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
        readerOption: {
            lazy: true,
            $value: {}
        }
    },
    applyReaderOption: function (value) {
        var opt = PSR.data.reader.Transform.getPathTreeOption({expand: true});
        opt = Object.assign(opt, value, {displayProperty: this.getDisplayField()});
        return opt;
    },
    createDataviewCfg: function (dataview, header) {
        if (!dataview || !dataview.xtype) {
            var opt = this.getReaderOption(),
                displayField = this.getDisplayField(),
                reader = {
                    rootProperty: opt.rootProperty,
                    transform: function (data) {
                        if (data) {
                            for (let i = 0; i < data.length; i++) {
                                var record = data[i];
                                if (!record[opt.pathProperty]) {
                                    record[opt.pathProperty] = record[displayField];
                                }
                            }
                        }
                        return PSR.data.reader.Transform.pathTree(data, opt);
                    }
                };
            return Object.assign({
                xtype: 'tree',
                selectable: {
                    mode: 'multi'
                },
                rootVisible: false,
                columns: [{
                    xtype: 'treecolumn', text: header, sortable: false, menuDisabled: true,
                    dataIndex: this.getDisplayField(),
                    minWidth: 100,
                    flex: 1,
                    cell: {
                        encodeHtml: false,
                    },
                    renderer: function (value, record) {
                        if (record.data.isRecord) {
                            return '<b><u>' + value + '</u></b>';
                        } else {
                            return value;
                        }
                    }
                }],
                store: {
                    type: 'tree',
                    filterer: 'bottomup',
                    proxy: {
                        type: 'memory',
                        data: [],
                        reader: reader
                    },
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
