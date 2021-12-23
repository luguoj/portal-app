Ext.define('PortalApp.view.portalConsole.navigationItem.EditorView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-navigationitem-editorview',
    controller: 'portalconsole-navigationitem-editorviewcontroller',
    config: {
        navigationItem: null
    },
    layout: 'fit',
    bodyPadding: 10,
    defaults: {
        frame: true,
        ui: 'light',
        margin: '0 0 10 0'
    },
    items: [{
        xtype: 'panel',
        title: '视图配置',
        tools: [{
            iconCls: 'x-fa fa-clipboard-check',
            handler: 'hBtnCheck',
            bind: {
                disabled: '{!dirty}'
            }
        }, {
            iconCls: 'x-fa fa-save',
            handler: 'hBtnSave',
            bind: {
                disabled: '{!dirty}'
            }
        }, {
            iconCls: 'x-fa fa-redo-alt',
            handler: 'hBtnRefresh'
        }],
        layout: 'fit',
        items: [{
            xtype: 'form',
            reference: 'form',
            padding: 10,
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
                emptyText: '选择模块',
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
                name: 'viewConfig',
                flex: 1
            }],
            listeners: {
                dirtychange: 'onFrmDirtyChange'
            }
        }]
    }],
    listeners: {
        afterrender: 'onAfterRendered'
    },
    bind: {
        title: '视图:{navigationItem.text}'
    },
    updateNavigationItem: function (value) {
        const viewModel = this.getViewModel(),
            controller = this.getController();
        viewModel.set('navigationItem', value);
        if (this.rendered) {
            controller.loadData();
        }
    },
    viewModel: {
        data: {
            navigationItem: null,
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
