Ext.define('PortalApp.view.portalConsole.dashboard.part.EditorView', {
    extend: 'Ext.window.Window',
    xtype: 'portalconsole-dashboard-part-editorview',
    config: {
        dashboardPart: null
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
        xtype: 'form',
        reference: 'form',
        frame: true,
        padding: '10 10 0 10',
        trackResetOnLoad: true,
        defaults: {
            anchor: '100%'
        },
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'combobox',
            name: 'moduleId',
            valueField: 'id',
            displayField: 'code',
            forceSelection: true,
            fieldLabel: '选择模块',
            typeAhead: true,
            pageSize: 50,
            listConfig: {
                loadingText: '搜索中...',
                emptyText: '没有发现匹配的模块.',
            },
            beforeQuery: function (queryPlan) {
                this.getStore().addFilter(
                    {
                        property: 'code',
                        operator: 'like',
                        value: '%' + queryPlan.query + '%'
                    }, true);
                return queryPlan;
            },
            bind: {
                store: '{modules}'
            }
        }, {
            xtype: 'textareafield',
            name: 'configValue',
            fieldLabel: '部件配置',
            flex: 1
        }, {
            xtype: 'textareafield', reference: 'txtTestingConfig',
            flex: 1,
            fieldLabel: '部件测试配置'
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
        title: '部件配置 {partCode}'
    },
    updateDashboardPart: function (value) {
        this.getViewModel().set('partCode', value.get('code'));
        this.getController().loadData();
    },
    controller: 'portalconsole-dashboard-part-editorviewcontroller',
    viewModel: {
        data: {
            partCode: '',
            dirty: false
        },
        stores: {
            modules: {
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.ModuleEntity',
                pageSize: 50,
                remoteSort: true,
                autoLoad: true
            }
        }
    }
});
