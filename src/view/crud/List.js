Ext.define('PSR.view.crud.List', {
    extend: 'Ext.Container',
    layout: 'fit',
    items: [],
    controller: {},
    viewModel: {},
    // 抽象成员
    isTree: false,
    columns: [],
    actionColumns: [],
    searchFields: [],
    actionToolbars: [],
    config: {
        actions: {
            create: true,
            clone: true,
            delete: true
        }
    },
    constructor: function (config) {
        var defaultActions = this.config.actions,
            configActions = config.actions,
            actions = this.actions = Object.assign({}, defaultActions);
        if (configActions) {
            for (var action in actions) {
                if (configActions[action] != null) {
                    actions[action] = configActions[action];
                }
            }
        }
        this.createItemsConfig(config);
        this.createViewModelConfig(config);
        this.createControllerConfig(config);
        this.callParent([config]);
    },
    refresh: function () {
        this.getController().refresh();
    },
    refreshRecord: function (dirty) {
        var store = this.getViewModel().getStore('entities'),
            record = store.isTreeStore ? store.findNode('id', dirty.id) : store.findRecord('id', dirty.id);
        if (!record) {
            this.refresh();
            return;
        }
        if (!dirty.catalogId && record.data.catalog) {
            this.refresh();
            return;
        }
        if (dirty.catalogId && (!record.data.catalog || record.data.catalog.id != dirty.catalogId)) {
            this.refresh();
            return;
        }
        for (var dirtyKey in dirty) {
            record.set(dirtyKey, dirty[dirtyKey]);
        }
        if (record.data.catalog || dirty.catalogId) {
            record.set('catalog', dirty.catalogId ? {id: dirty.catalogId} : null);
        }
    },
    createItemsConfig: function (config) {
        var vThis = this,
            isTree = this.isTree,
            columns = this.columns,
            actionColumns = this.actionColumns,
            searchFields = this.searchFields,
            actionToolbars = this.actionToolbars,
            actions = this.actions,
            items = [].concat(this.config.items),
            grd, clmns, grdItemController,
            tbsearch, tbcrud, tbcontainer,
            frmSearchFilter;
        this.config.items = items;
        // 创建工具栏容器
        tbcontainer = {xtype: 'psr-toolbar-topcontainer', items: []};
        // 创建搜索工具栏
        tbsearch = {xtype: 'psr-toolbar-search', reference: 'tbsearch'};
        if (searchFields && searchFields.length > 0) {
            tbsearch.searchHandler = 'search';
        } else {
            tbsearch.refreshHandler = 'refresh';
            tbsearch.filterHandler = 'filter';
        }
        tbcontainer.items.push(tbsearch);
        // 创建增删改查工具栏
        tbcrud = {
            xtype: 'psr-toolbar-crudlist', detailsHandler: 'details', bind: {selection: '{grdselection}'},
            createHandler: (actions && actions.create) ? 'create' : null,
            deleteHandler: (actions && actions.delete) ? 'delete' : null,
            cloneHandler: (actions && actions.clone) ? 'clone' : null
        };
        tbcontainer.items.push({xtype: 'container', width: 1}, tbcrud);
        // 创建操作工具栏
        if (!actionToolbars || actionToolbars.length == 0) {
            tbcrud.flex = 1;
        } else {
            for (var i = 0; i < actionToolbars.length; i++) {
                tbcontainer.items.push({xtype: 'container', width: 1});
                tbcontainer.items.push(actionToolbars[i]);
            }
        }
        tbcontainer.items[tbcontainer.items.length - 1].flex = 1;
        // 创建搜索过滤表单
        if (searchFields && searchFields.length > 0) {
            frmSearchFilter = {
                xtype: 'psr-panel-form-left', reference: 'searchFilter',
                items: searchFields,
                bind: {hidden: '{!tbsearch.searchFilterShowed}'}
            };
            items.push(frmSearchFilter);
        }
        // 创建表格列
        clmns = [].concat(columns);
        grdItemController = {
            goDetails: function (record) {
                vThis.fireEvent('goDetails', record);
            }
        };
        if (actionColumns && actionColumns.length > 0) {
            for (let i = 0; i < actionColumns.length; i++) {
                var actionColumn = actionColumns[i],
                    action = actionColumn.action,
                    text = actionColumn.text,
                    width = actionColumn.width ? actionColumn.width : 50;
                if (actions[action]) {
                    clmns.push({
                        xtype: 'psr-grid-column-href',
                        width: width, maxWidth: width, minWidth: width,
                        menuDisabled: true,
                        sortable: false,
                        cell: {
                            renderer: function (value, record) {
                                return !record.data.isPath ? text : '';
                            },
                            handler: action
                        }
                    });
                    grdItemController[action] = function (record) {
                        vThis.fireEvent(action, record);
                    };
                }
            }
        }
        if (isTree) {
            grd = {
                xtype: 'tree', reference: 'grd',
                rootVisible: false,
                columns: clmns,
                items:[tbcontainer],
                bind: {store: '{entities}'},
                itemConfig: {
                    viewModel: {},
                    controller: grdItemController
                },
            }
        } else {
            grd = {
                xtype: 'grid', reference: 'grd',
                columns: clmns,
                items:[tbcontainer],
                bind: {store: '{entities}'},
                itemConfig: {
                    viewModel: {},
                    controller: grdItemController
                },
            }
            if (this.config.viewModel.stores.entities.pageSize) {
                grd.plugins = {gridpagingtoolbar: true};
            }
        }
        items.push(grd);
    },
    createViewModelConfig: function (config) {
        var viewModel = Object.assign({}, this.config.viewModel),
            formulas, data,
            actions = this.actions;
        this.config.viewModel = viewModel;
        if (!viewModel || !viewModel.stores || !viewModel.stores.entities) {
            PSR.Message.error('CRUD视图缺少entities');
        }
        // 组装data
        data = {actions: actions};
        viewModel.data = Object.assign(data, viewModel.data);
        // 组装formulas
        formulas = {
            grdselection: function (get) {
                var selection = get('grd.selection');
                return (selection && !selection.data.isPath) ? selection : null;
            }
        };
        viewModel.formulas = Object.assign(formulas, viewModel.formulas);
    },
    createControllerConfig: function (config) {
        if (!this.config.controller || !this.config.controller.getService) {
            PSR.Message.error('CRUD视图缺少getService');
        }
        var controller = {
            details: function (selection) {
                this.getView().fireEvent('goDetails', selection);
            },
            search: function () {
                var vm = this.getViewModel(),
                    store = vm.getStore('entities'),
                    proxy = store.getProxy(),
                    searchFilter = this.lookup('searchFilter'),
                    params;
                if (searchFilter) {
                    params = Object.assign(proxy.getExtraParams(), searchFilter.getValues());
                    proxy.setExtraParams(params);
                }
                store.load();
            },
            refresh: function () {
                var vm = this.getViewModel(),
                    store = vm.getStore('entities');
                store.reload();
            },
            filter: function (field, value) {
                var me = this,
                    v = this.getView(),
                    vm = this.getViewModel(),
                    store = vm.getStore('entities');
                if (value && value.length > 0) {
                    store.getFilters().replaceAll({
                        property: 'displaytext',
                        value: new RegExp(Ext.String.escapeRegex(value), 'i')
                    });
                } else {
                    store.clearFilter();
                }
            },
            create: function () {
                this.getView().fireEvent('goDetails', null);
            },
            clone: function (selection) {
                var me = this,
                    v = this.getView(),
                    vm = this.getViewModel(),
                    store = vm.getStore('entities');
                v.mask();
                me.getService().clone({
                    id: selection.data.id,
                    success: function () {
                        store.reload();
                    },
                    complete: function () {
                        v.unmask();
                    }
                });
            },
            delete: function (selection) {
                var me = this,
                    v = this.getView(),
                    vm = this.getViewModel(),
                    store = vm.getStore('entities');
                v.mask();
                me.getService().delete({
                    id: selection.data.id,
                    success: function () {
                        store.reload();
                    },
                    complete: function () {
                        v.unmask();
                    }
                });
            }
        };
        this.config.controller = Object.assign(controller, this.config.controller);
    }
});
