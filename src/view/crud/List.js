Ext.define('PSR.view.crud.List', {
    extend: 'Ext.Container',
    layout: 'fit',
    items: [],
    controller: {},
    viewModel: {},
    isViewClassInit: false,
    // 抽象成员
    title: '',
    isTree: false,
    columns: [],
    actionColumns: [],
    itemController: {},
    searchFields: [],
    actionToolbars: [],
    actionPrefix: '',
    config: {
        goBack: false,
        actions: {
            create: true,
            clone: true,
            delete: true
        }
    },
    constructor: function (config) {
        if (!this.isViewClassInit) {
            this.createItemsConfig();
            this.createViewModelConfig();
            this.createControllerConfig();
            this.isViewClassInit = true;
        }
        this.callParent([config]);
    },
    updateActions: function (actions) {
        const vm = this.getViewModel();
        if (actions) {
            for (const actionsKey in actions) {
                vm.set('action_' + actionsKey, actions[actionsKey]);
            }
        }
    },
    load: function (opt, callback) {
        const store = this.getViewModel().getStore('entities');
        if (opt) {
            this.extraParams = this.getExtraParams(opt);
            if (this.requireRefresh(opt)) {
                this.getController().refresh();
            } else if (opt.isNew) {
                this.getController().refresh();
            } else if (opt.record) {
                const dirtyRecord = opt.record;
                let record = store.isTreeStore ? store.findNode('id', dirtyRecord.id) : store.findRecord('id', dirtyRecord.id);
                if (!record) {
                    this.getController().refresh();
                } else if (!dirtyRecord.catalogId && record.data.catalog) {
                    this.getController().refresh();
                } else if (dirtyRecord.catalogId && (!record.data.catalog || record.data.catalog.id != dirtyRecord.catalogId)) {
                    this.getController().refresh();
                } else {
                    for (let dirtyRecordKey in dirtyRecord) {
                        record.set(dirtyRecordKey, dirtyRecord[dirtyRecordKey]);
                    }
                }
            }
        } else {
            this.getController().refresh();
        }
        if (callback) {
            callback();
        }
    },
    requireRefresh: function (record) {
        return false;
    },
    getExtraParams: function (opt) {
        return {};
    },
    createItemsConfig: function () {
        const vThis = this,
            isTree = this.isTree,
            columns = this.columns,
            actionColumns = this.actionColumns,
            itemController = this.itemController,
            searchFields = this.searchFields,
            actionToolbars = this.actionToolbars,
            actionPrefix = this.actionPrefix,
            items = [].concat(this.config.items);
        let grd, clmns, grdItemController,
            tbnav, tbsearch, tbcrud, tbcontainer,
            frmSearchFilter;
        this.config.items = items;
        // 创建工具栏容器
        tbcontainer = {xtype: 'psr-toolbar-topcontainer', items: []};
        // 创建导航工具栏
        tbnav = {
            xtype: 'toolbar',
            items: [{xtype: 'psr-button-goback', handler: 'goBack'}],
            bind: {hidden: '{!goBack}'}
        };
        tbcontainer.items.push(tbnav);
        // 创建搜索工具栏
        tbsearch = {xtype: 'psr-toolbar-search', reference: 'tbsearch'};
        if (searchFields && searchFields.length > 0) {
            tbsearch.searchHandler = 'search';
        } else {
            tbsearch.refreshHandler = 'refresh';
            tbsearch.filterHandler = 'filter';
        }
        tbcontainer.items.push({xtype: 'container', width: 1});
        tbcontainer.items.push(tbsearch);
        // 创建增删改查工具栏
        tbcrud = {
            xtype: 'psr-toolbar-crudlist', detailsHandler: 'goDetails',
            bind: {
                selection: '{grdselection}',
                createHandler: '{action_' + actionPrefix + 'create ? "create" : null}',
                deleteHandler: '{action_' + actionPrefix + 'delete ? "delete" : null}',
                cloneHandler: '{action_' + actionPrefix + 'clone ? "clone" : null}',
            }
        };
        tbcontainer.items.push({xtype: 'container', width: 1}, tbcrud);
        // 创建操作工具栏
        if (!actionToolbars || actionToolbars.length == 0) {
            tbcrud.flex = 1;
        } else {
            for (let i = 0; i < actionToolbars.length; i++) {
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
            filterRenderer: function (value) {
                const filterText = vThis.getViewModel().get('tbsearch.filterText');
                return PSR.util.Grid.filterRenderer(value, filterText);
            },
            getListView: function () {
                return vThis;
            },
            goDetails: function (record) {
                vThis.getController().fireActionEvent('goDetails', record);
            }
        };
        if (actionColumns && actionColumns.length > 0) {
            for (let i = 0; i < actionColumns.length; i++) {
                const actionColumn = actionColumns[i],
                    action = actionColumn.action,
                    text = actionColumn.text;
                clmns.push({
                    xtype: 'psr-grid-column-hrefaction',
                    text: text,
                    action: action,
                    bind: {hidden: '{!action_' + actionPrefix + action + '}'}
                });
                grdItemController[action] = function (record) {
                    vThis.getController()[action](record);
                };
            }
        }
        grdItemController = Object.assign(grdItemController, itemController);
        if (isTree) {
            grd = {
                xtype: 'tree', reference: 'grd',
                rootVisible: false, rowLines: true, columnLines: true,
                columns: clmns,
                items: [tbcontainer],
                bind: {store: '{entities}'},
                itemConfig: {
                    viewModel: {},
                    controller: grdItemController
                },
            }
        } else {
            grd = {
                xtype: 'grid', reference: 'grd',
                rowLines: true, columnLines: true,
                columns: clmns,
                items: [tbcontainer],
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
    createViewModelConfig: function () {
        const actions = this.config.actions
        goBack = this.config.goBack,
            viewModel = Object.assign({}, this.config.viewModel);
        let formulas, data;
        this.config.viewModel = viewModel;
        if (!viewModel || !viewModel.stores || !viewModel.stores.entities) {
            PSR.Message.error('CRUD视图缺少entities');
        }
        // 组装data
        data = {goBack: goBack ? true : false};
        if (actions) {
            for (const actionsKey in actions) {
                data['action_' + actionsKey] = actions[actionsKey];
            }
        }
        viewModel.data = Object.assign(data, viewModel.data);
        // 组装formulas
        formulas = {
            grdselection: function (get) {
                const selection = get('grd.selection');
                return (selection && !selection.data.isPath) ? selection : null;
            }
        };
        viewModel.formulas = Object.assign(formulas, viewModel.formulas);
    },
    createControllerConfig: function () {
        const actionColumns = this.actionColumns;
        if (!this.config.controller || !this.config.controller.getService) {
            PSR.Message.error('CRUD视图缺少getService');
        }
        const controller = {
            fireActionEvent: function (eventName, record) {
                const selection = (record && record.isModel) ? record : this.lookup('grd').getSelection();
                this.getView().fireEvent(eventName, selection ? {
                    id: selection.get('id'),
                    displaytext: selection.get('displaytext')
                } : null);
            },
            goDetails: function () {
                this.fireActionEvent('goDetails');
            },
            create: function (selection) {
                this.fireActionEvent('create', selection);
            },
            search: function () {
                const v = this.getView(),
                    vm = this.getViewModel(),
                    store = vm.getStore('entities'),
                    proxy = store.getProxy(),
                    searchFilter = this.lookup('searchFilter'),
                    extraParams = v.extraParams;
                let params = Object.assign({}, proxy.getExtraParams(), extraParams);
                if (searchFilter) {
                    params = Object.assign(params, searchFilter.getValues());
                }
                proxy.setExtraParams(params);
                store.loadPage(1);
            },
            refresh: function () {
                const v = this.getView(),
                    vm = this.getViewModel(),
                    store = vm.getStore('entities'),
                    proxy = store.getProxy(),
                    extraParams = v.extraParams,
                    searchfield = v.lookup('tbsearch').down('searchfield');
                if (searchfield) {
                    searchfield.setValue('');
                }
                let params = Object.assign({}, proxy.getExtraParams(), extraParams);
                proxy.setExtraParams(params);
                store.loadPage(1);
            },
            filter: function (field, value) {
                const me = this,
                    vm = me.getViewModel(),
                    store = vm.getStore('entities');
                PSR.util.Store.filter(value, 'displaytext', store);
            },
            clone: function (selection) {
                const me = this,
                    v = this.getView(),
                    vm = this.getViewModel(),
                    store = vm.getStore('entities');
                v.mask();
                me.getService().clone({
                    id: selection.data.id,
                    success: function () {
                        me.refresh();
                    },
                    complete: function () {
                        v.unmask();
                    }
                });
            },
            delete: function (selection) {
                const me = this,
                    v = this.getView(),
                    vm = this.getViewModel(),
                    store = vm.getStore('entities');
                v.mask();
                me.getService().delete({
                    id: selection.data.id,
                    success: function () {
                        me.refresh();
                    },
                    complete: function () {
                        v.unmask();
                    }
                });
            },
            goBack: function () {
                this.getView().fireEvent('goback', {dirty: false});
            }
        };
        if (actionColumns && actionColumns.length > 0) {
            for (let i = 0; i < actionColumns.length; i++) {
                const actionColumn = actionColumns[i],
                    action = actionColumn.action;
                controller[action] = function (record) {
                    this.fireActionEvent(action, record);
                }
            }
        }
        this.config.controller = Object.assign(controller, this.config.controller);
    }
});
