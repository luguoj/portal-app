Ext.define('PortalApp.view.dashboard.part.EditorView', {
    extend: 'Ext.window.Window',
    xtype: 'dashboard-part-editorview',
    config: {
        partId: '',
        content: null
    },
    width: '75%',
    height: '75%',
    layout: {type: 'hbox', align: 'stretch'},
    bodyPadding: 10,
    tools: [{
        iconCls: 'x-fa fa-clipboard-check',
        tooltip: '校验',
        handler: 'hBtnCheck',
        bind: {
            disabled: '{!dirty}'
        }
    }, {
        iconCls: 'x-fa fa-save',
        tooltip: '保存',
        handler: 'hBtnSave',
        bind: {
            disabled: '{!dirty}'
        }
    }, {
        iconCls: 'x-fa fa-redo-alt',
        tooltip: '还原',
        handler: 'hBtnRefresh'
    }],
    items: [{
        flex: 1,
        xtype: 'form', reference: 'form',
        frame: true,
        trackResetOnLoad: true,
        padding: '10 10 0 10',
        defaults: {
            anchor: '100%'
        },
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'treepicker', name: 'dashboardPartId',
            valueField: 'id',
            displayField: 'code',
            rootVisible: false,
            emptyText: '选择部件',
            columns: [{
                xtype: 'treecolumn',
                flex: 1,
                dataIndex: 'code',
                renderer: function (value, metaData, record) {
                    if (record.get('isRecord')) {
                        return '<u><b>' + record.get('code') + '</b></u>';
                    } else {
                        return record.get('code');
                    }
                },
            }],
            bind: {
                store: '{modulePartTree}'
            },
            onItemClick: function (view, record, node, rowIndex, e) {
                if (record.get('part')) {
                    this.selectItem(record);
                }
            },
            listeners: {
                change: 'loadPart'
            }
        }, {
            xtype: 'textfield', reference: 'txtPartModuleId',
            fieldLabel: '模板模块ID',
            editable: false
        }, {
            xtype: 'textareafield', reference: 'txtPartConfigValue',
            flex: 1,
            fieldLabel: '部件配置',
            editable: false
        }, {
            xtype: 'textareafield', name: 'extraConfigValue',
            flex: 1,
            fieldLabel: '部件额外配置'
        }],
        listeners: {
            dirtychange: 'onFrmDirtyChange'
        }
    }, {
        xtype: 'splitter',
        maskOnDisable: false,
        collapseOnDblClick: false,
        height: 3, width: 3
    }, {
        flex: 1,
        xtype: 'panel', reference: 'pnPreview',
        frame: true,
        layout: 'fit'
    }],
    bind: {
        title: '部件{partId}配置'
    },
    updatePartId: function (value) {
        this.getViewModel().set('partId', value);
    },
    updateContent: function (value) {
        this.getController().loadData();
    },
    controller: 'dashboard-part-editorviewcontroller',
    viewModel: {
        data: {
            partId: '',
            dirty: false
        },
        stores: {
            modulePartTree: {
                fields: ['id', 'version', 'module', 'part', 'expanded', 'leaf', 'code', 'description', 'enable'],
                type: 'tree',
                root: {
                    expanded: true
                },
                sorters: [{property: 'code', direction: 'ASC'}],
                proxy: {
                    type: 'memory',
                    data: []
                }
            },
            modules: {
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.ModuleEntity',
                autoLoad: false,
                listeners: {
                    load: 'onDataLoad'
                }
            },
            parts: {
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.DashboardPartEntity',
                autoLoad: false,
                listeners: {
                    load: 'onDataLoad'
                }
            },
        }
    }
});