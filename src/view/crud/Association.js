Ext.define('PSR.view.crud.Association', {
    extend: 'Ext.Container',
    layout: 'fit',
    items: [],
    controller: {},
    viewModel: {},
    isViewClassInit: false,
    // 抽象成员
    title: '关系',
    isTree: false,
    entitySide: 'left',
    searchFields: [],
    updateAction: 'updateAssociation',
    config: {
        actions: {
            updateAssociation: true
        }
    },
    constructor: function (config) {
        if (!this.isViewClassInit) {
            this.createItemsConfig();
            this.createViewModelConfig();
            this.createControllerConfig();
            this.isViewClassInit = true;
        }
        this._title = this.title;
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
        this.title = (opt ? opt.displaytext + ' ' : '') + this._title;
        this.getController().loadEntity(opt ? opt.id : null);
        if (callback) {
            callback();
        }
    },
    createItemsConfig: function (config) {
        var vThis = this,
            isTree = this.isTree,
            title = this.title,
            updateAction = this.updateAction,
            items = [].concat(this.config.items),
            searchFields = this.searchFields,
            tbcontainer, tbnav, tbsearch, tbeditor,
            frmSearchFilter, grd, clmns, grdItemController;
        this.config.items = items;
        // 创建工具栏容器
        tbcontainer = {xtype: 'psr-toolbar-topcontainer', items: []};
        // 创建导航工具栏
        tbnav = {xtype: 'toolbar', items: [{xtype: 'psr-button-goback', handler: 'goBack'}]};
        tbcontainer.items.push(tbnav);
        tbcontainer.items.push({xtype: 'container', width: 1});
        // 创建搜索工具栏
        tbsearch = {xtype: 'psr-toolbar-search', reference: 'tbsearch'};
        if (searchFields && searchFields.length > 0) {
            tbsearch.searchHandler = 'search';
        } else {
            tbsearch.refreshHandler = 'refresh';
            tbsearch.filterHandler = 'filter';
        }
        tbcontainer.items.push(tbsearch);
        tbcontainer.items.push({xtype: 'container', width: 1});
        // 创建编辑工具栏
        tbeditor = {
            xtype: 'psr-toolbar-editor', reference: 'tbeditor',
            flex: 1,
            resetHandler: 'reset',
            bind: {editable: '{action_' + updateAction + '}'}
        };
        tbcontainer.items.push(tbeditor);
        // 创建搜索过滤表单
        if (searchFields && searchFields.length > 0) {
            frmSearchFilter = {
                xtype: 'psr-panel-form-left', reference: 'searchFilter',
                items: searchFields,
                bind: {hidden: '{!tbsearch.searchFilterShowed}'}
            };
            items.push(frmSearchFilter);
        }
        // 创建表格
        clmns = [{
            xtype: 'psr-grid-column-toggle',
            flagIndex: 'assignFlag',
            disabledBinding: '!tbeditor.editing',
            toggleHandler: 'associate'
        }, {
            xtype: isTree ? 'treecolumn' : 'column',
            text: title, flex: 1, menuDisabled: true,
            dataIndex: 'displaytext',
        }];
        grdItemController = {
            associate: function (button) {
                var vm = this.getViewModel(),
                    c = vThis.getController(),
                    record = vm.get('record');
                if (!record.data.assignFlag) {
                    c.create(record);
                } else {
                    c.delete(record);
                }
            }
        };
        if (isTree) {
            grd = {
                xtype: 'tree', reference: 'grd',
                rootVisible: false, rowLines: true, columnLines: true,
                columns: clmns,
                items: [tbcontainer],
                bind: {store: '{entities}'},
                itemConfig: {
                    viewModel: true,
                    controller: grdItemController
                }
            }
        } else {
            grd = {
                xtype: 'grid', reference: 'grd',
                rowLines: true, columnLines: true,
                columns: clmns,
                items: [tbcontainer],
                bind: {store: '{entities}'},
                itemConfig: {
                    viewModel: true,
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
        var viewModel = Object.assign({}, this.config.viewModel),
            data,
            actions = this.config.actions;
        this.config.viewModel = viewModel;
        // 组装data
        data = {text: '', entityId: null, associations: {}};
        if (actions) {
            for (const actionsKey in actions) {
                data['action_' + actionsKey] = actions[actionsKey];
            }
        }
        viewModel.data = Object.assign(data, viewModel.data);
    },
    createControllerConfig: function () {
        if (!this.config.controller || !this.config.controller.getService) {
            PSR.Message.error('CRUD视图缺少getService');
        }
        const entitySide = this.entitySide;
        const controller = {
            initAssociation: function (record) {
                const me = this,
                    vm = me.getViewModel(),
                    associations = vm.get('associations');
                record.set('assignFlag', !!associations[record.id]);
                record.set('associationId', associations[record.id]);
                if (record.childNodes && record.childNodes.length > 0) {
                    for (let i = 0; i < record.childNodes.length; i++) {
                        me.initAssociation(record.childNodes[i]);
                    }
                }
            },
            initViewModel: function (vm) {
                const me = this,
                    store = vm.getStore('entities');
                store.on('load', function (store, records, successful, operation) {
                    if (records && records.length > 0) {
                        for (let i = 0; i < records.length; i++) {
                            me.initAssociation(records[i])
                        }
                    }
                });
            },
            goBack: function () {
                var vm = this.getViewModel(), v = this.getView();
                this.getView().fireEvent('goback', false);
                v.load(null);
            },
            reset: function () {
                var vm = this.getViewModel(), v = this.getView();
                this.loadEntity(vm.get('entityId'), vm.get('tbeditor.editing'));
            },
            loadEntity: function (entityId, editing) {
                var me = this,
                    v = this.getView(),
                    vm = this.getViewModel(),
                    tbeditor = me.lookup('tbeditor');
                vm.set('entityId', entityId);
                v.mask();
                if (entityId) {
                    if (editing) {
                        tbeditor.toggleEditing();
                    } else {
                        tbeditor.toggleViewing();
                    }
                    // 查询关联清单
                    if (entitySide == 'left') {
                        me.getService().loadAllByLeftId({
                            leftId: entityId,
                            success: function (respObj) {
                                var associations = {};
                                if (respObj) {
                                    for (let i = 0; i < respObj.length; i++) {
                                        associations[respObj[i].rightId] = respObj[i].id;
                                    }
                                }
                                vm.set('associations', associations);
                                vm.getStore('entities').load();
                            },
                            complete: function () {
                                v.unmask();
                            }
                        });
                    } else {
                        me.getService().loadAllByRightId({
                            rightId: entityId,
                            success: function (respObj) {
                                var associations = {};
                                if (respObj) {
                                    for (let i = 0; i < respObj.length; i++) {
                                        associations[respObj[i].leftId] = respObj[i].id;
                                    }
                                }
                                vm.set('associations', associations);
                                vm.getStore('entities').load();
                            },
                            complete: function () {
                                v.unmask();
                            }
                        });
                    }
                } else {
                    vm.set('associations', {});
                    tbeditor.toggleViewing();
                }
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
            create: function (record) {
                var v = this.getView(),
                    vm = this.getViewModel(),
                    entityId = vm.get('entityId'),
                    associations = vm.get('associations'),
                    associationId = associations[record.data.id];
                if (!associationId) {
                    v.mask();
                    /**
                     * @Description: 创建关联
                     * @author ZHOUDD
                     * @date 2020/7/21
                     */
                    this.getService().create({
                        values: {
                            leftId: entitySide == 'left' ? entityId : record.data.id,
                            rightId: entitySide == 'left' ? record.data.id : entityId
                        },
                        success: function (resbObj) {
                            record.set('assignFlag', true);
                            record.set('associationId', resbObj.id);
                            associations[record.data.id] = resbObj.id;
                            Ext.toast('保存成功');
                        },
                        failure: function () {
                            Ext.toast('保存失败');
                        },
                        complete: function () {
                            v.unmask();
                        }
                    });
                }
            },
            delete: function (record) {
                var v = this.getView(),
                    vm = this.getViewModel(),
                    entityId = vm.get('entityId'),
                    associations = vm.get('associations'),
                    associationId = associations[record.data.id];
                if (associationId) {
                    v.mask();
                    this.getService().delete({
                        id: associationId,
                        success: function () {
                            record.set('assignFlag', false);
                            record.set('associationId', null);
                            delete (associations[record.data.id]);
                            Ext.toast('保存成功');
                        },
                        failure: function () {
                            Ext.toast('保存失败');
                        },
                        complete: function () {
                            v.unmask();
                        }
                    });
                }
            }
        };
        this.config.controller = Object.assign(controller, this.config.controller);
    }
});
