Ext.define('PSR.view.crud.List', {
    extend: 'PSR.view.work.SubView',
    //****** SubView 配置默认值
    // 视图标题
    viewTitle: '清单',
    // 是否支持返回上一视图操作
    goBack: false,
    // 操作
    actions: {
        go_details: true,
        create: true,
        clone: false,
        delete: true
    },
    //****** List 配置
    config: {
        // 是否树形清单
        isTree: false,
        // 数据列
        columns: [],
        // 操作列
        actionColumns: [],
        // 清单元素Controller
        itemController: {},
        // 搜索字段
        searchFields: []
    },
    // 是否需要刷新
    requireRefresh: function (opt) {
        return false;
    },
    // 获取额外参数
    getExtraParams: function (opt) {
        return {};
    },
    paramConverter: function (params) {
        return params;
    },
    updateActions: function (actions) {
        const vm = this.getViewModel(),
            actionPrefix = this.getActionPrefix(),
            isTree = this.getIsTree();
        if (actions) {
            const action_drag = actions[actionPrefix + 'drag'],
                grid = this.down('tree');
            if (grid) {
                if (action_drag) {
                    grid.addPlugin(isTree ? 'treedragdrop' : 'gridrowdragdrop').onViewInitialize(grid);
                }
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
                } else if (!dirtyRecord.catalogId && record.data.catalogId) {
                    this.getController().refresh();
                } else if (dirtyRecord.catalogId && (!record.data.catalogId || record.data.catalogId != dirtyRecord.catalogId)) {
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
    createItemsConfig: function (config) {
        const vThis = this,
            actionPrefix = config.actionPrefix || this.config.actionPrefix,
            searchFields = [].concat(config.searchFields || this.config.searchFields || []),
            isTree = config.isTree || this.config.isTree,
            columns = [].concat(config.columns || this.config.columns || []),
            actionColumns = [].concat(config.actionColumns || this.config.actionColumns || []),
            configItemController = Object.assign({}, this.config.itemController, config.itemController);
        //*** 创建工具栏
        const listToolbars = [];
        // 搜索工具栏
        const tbsearch = {xtype: 'psr-toolbar-search', reference: 'tbsearch'};
        if (searchFields && searchFields.length > 0) {
            tbsearch.searchHandler = 'search';
        } else {
            tbsearch.refreshHandler = 'refresh';
            tbsearch.filterHandler = 'filter';
        }
        listToolbars.push(tbsearch);
        // CRUD工具栏
        const tbcrud = {
            xtype: 'psr-toolbar-crudlist',
            bind: {
                selection: '{grdselection}',
                detailsHandler: '{action_' + actionPrefix + 'go_details ? "go_details" : null}',
                createHandler: '{action_' + actionPrefix + 'create ? "create" : null}',
                deleteHandler: '{action_' + actionPrefix + 'delete ? "delete" : null}',
                cloneHandler: '{action_' + actionPrefix + 'clone ? "clone" : null}',
            }
        };
        listToolbars.push(tbcrud);
        // 合并工具栏配置
        config.toolbars = listToolbars.concat(config.toolbars || this.config.toolbars || []);
        //*** 创建界面元素
        const listItems = [];
        // 搜索过滤表单
        if (searchFields && searchFields.length > 0) {
            const frmSearchFilter = {
                xtype: 'psr-panel-form-left', reference: 'searchFilter',
                items: searchFields,
                bind: {hidden: '{!tbsearch.searchFilterShowed}'}
            };
            listItems.push(frmSearchFilter);
        }
        // 清单表格
        const grdItemController = {
                filterRenderer: function (value) {
                    const filterText = vThis.getViewModel().get('tbsearch.filterText');
                    return PSR.util.Grid.filterRenderer(value, filterText);
                },
                getListView: function () {
                    return vThis;
                },
                go_details: function (record) {
                    vThis.getController().fireActionEvent('go_details', {record: record});
                }
            },
            grd = {
                reference: 'grd',
                rowLines: true, columnLines: true,
                columns: columns,
                bind: {store: '{entities}'},
                itemConfig: {
                    viewModel: {},
                    controller: grdItemController
                },
                plugins: {}
            };
        if (actionColumns.length > 0) {
            for (let i = 0; i < actionColumns.length; i++) {
                const actionColumn = actionColumns[i],
                    action = actionColumn.action,
                    text = actionColumn.text;
                columns.push({
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
        Object.assign(grdItemController, configItemController);
        if (isTree) {
            Object.assign(grd, {
                xtype: 'tree',
                rootVisible: false,
                listeners: {beforedrop: 'grdBeforeDrop', drop: 'grdDrop'}
            });
        } else {
            Object.assign(grd, {
                xtype: 'grid'
            });
            if (config.viewModel && config.viewModel.stores && config.viewModel.stores.entities.pageSize) {
                grd.plugins.gridpagingtoolbar = true;
            } else if (this.config.viewModel && this.config.viewModel.stores && this.config.viewModel.stores.entities.pageSize) {
                grd.plugins.gridpagingtoolbar = true;
            }
        }
        listItems.push(grd);
        // 合并界面元素配置
        config.items = listItems.concat(config.items || this.config.items || []);
        this.callParent([config]);
    },
    createViewModelConfig: function (config) {
        // 校验entities store
        if (!(config.viewModel && config.viewModel.stores && config.viewModel.stores.entities)
            && !(this.config.viewModel && this.config.viewModel.stores && this.config.viewModel.stores.entities)) {
            PSR.Message.error('CRUD视图缺少vm.store.entities');
        }
        // 清单选中项
        const viewModel = config.viewModel = config.viewModel || {},
            formulas = viewModel.formulas = viewModel.formulas || {};
        formulas.grdselection = function (get) {
            const selection = get('grd.selection');
            return (selection && selection.data.isRecord) ? selection : null;
        };
        this.callParent([config]);
    },
    createControllerConfig: function (config) {
        const actionPrefix = config.actionPrefix || this.config.actionPrefix,
            actionColumns = [].concat(config.actionColumns || this.config.actionColumns || []),
            configController = Object.assign({}, this.config.controller, config.controller);
        if (!(config.controller && config.controller.getService)
            && !(this.config.controller && this.config.controller.getService)) {
            PSR.Message.error('CRUD视图缺少controller.getService');
        }
        const controller = {
            fireActionEvent: function (eventName, record) {
                const selection = (record && record.isModel) ? record : this.lookup('grd').getSelection();
                this.getView().fireEvent(eventName, {selection: selection ? selection.data : null});
            },
            go_details: function () {
                this.fireActionEvent('go_details');
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
                proxy.setExtraParams(v.paramConverter(params));
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
                proxy.setExtraParams(v.paramConverter(params));
                store.loadPage(1);
            },
            filter: function (field, value) {
                const me = this,
                    vm = me.getViewModel(),
                    store = vm.getStore('entities');
                PSR.util.Store.filterText(store, 'displaytext', value);
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
            },
            grdBeforeDrop: function (targetNode, draggedData, targetRecord, position) {
                return true;
            },
            grdDrop: function (targetNode, draggedData, targetRecord, position) {

            },
            doDrop: function (targetNode, draggedData, targetRecord, position) {
                const v = this.getView(),
                    grd = v.lookup('grd'),
                    dragdrop = v.getIsTree() ? grd.findPlugin('treedragdrop') : grd.findPlugin('gridrowdragdrop'),
                    dropZone = dragdrop.dropZone,
                    dragInfo = {
                        draggedData: draggedData,
                        targetRecord: targetRecord,
                        position: position,
                        targetNode: targetRecord
                    };
                dropZone.onNodeDrop(dragInfo);
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
        config.controller = Object.assign(controller, configController);
        this.callParent([config]);
    }
});
