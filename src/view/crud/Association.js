Ext.define('PSR.view.crud.Association', {
    extend: 'Ext.Container',
    layout: 'fit',
    items: [],
    controller: {},
    viewModel: {},
    // 抽象成员
    isTree: false,
    entitySide: 'left',
    searchFields: [],
    title: '关系',
    updateAction: 'updateAssociation',
    config: {
        actions: {
            updateAssociation: true
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
    loadEntity: function (record) {
        this.getController().loadEntity(record ? record.data.id : null);
        this.getViewModel().set('text', record ? record.get('displaytext') : '');
    },
    createItemsConfig: function (config) {
        var vThis = this,
            actions = this.actions,
            isTree = this.isTree,
            title = this.title,
            updateAction = this.updateAction,
            items = [].concat(this.config.items),
            searchFields = this.searchFields,
            tbtitle, tbcontainer, tbsearch, tbeditor,
            frmSearchFilter, grd, clmns, grdItemController;
        this.config.items = items;
        // 创建标题
        tbtitle = {xtype: 'psr-toolbar-navigation', bind: {title: title + ': {text}'}, goBackHandler: 'goBack'};
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
        // 创建编辑工具栏
        tbeditor = {
            xtype: 'psr-toolbar-editor', reference: 'tbeditor',
            flex: 1,
            resetHandler: 'reset',
            editable: actions && actions[updateAction]
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
            width: 55, menuDisabled: true, align: 'center',
            cell: {
                xtype: 'widgetcell',
                widget: {
                    xtype: 'button',
                    width: 45,
                    bind: {
                        tooltip: '{record.assignFlag?"是":"否"}',
                        iconCls: '{record.assignFlag?"x-fa fa-check":"x-fa fa-times"}',
                        hidden: '{record.isPath}',
                        disabled: '{!tbeditor.editing}',
                        ui: '{record.assignFlag?"confirm":"decline"}'
                    },
                    handler: 'associate'
                }
            }
        }, {
            xtype: isTree ? 'treecolumn' : 'column',
            text: title, flex: 1, menuDisabled: true,
            dataIndex: 'displaytext'
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
                rootVisible: false,
                columns: clmns,
                items: [tbtitle, tbcontainer],
                bind: {store: '{entities}'},
                itemConfig: {
                    viewModel: true,
                    controller: grdItemController
                }
            }
        } else {
            grd = {
                xtype: 'grid', reference: 'grd',
                columns: clmns,
                items: [tbtitle, tbcontainer],
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
    createViewModelConfig: function (config) {
        var viewModel = Object.assign({}, this.config.viewModel),
            data,
            actions = this.actions;
        this.config.viewModel = viewModel;
        // 组装data
        data = {actions: actions, text: '', entityId: null, associations: {}};
        viewModel.data = Object.assign(data, viewModel.data);
    },
    createControllerConfig: function (config) {
        var entitySide = this.entitySide;
        if (!this.config.controller || !this.config.controller.getService) {
            PSR.Message.error('CRUD视图缺少getService');
        }
        var controller = {
            initViewModel: function (vm) {
                var store = vm.getStore('entities'),
                    reader = store.getProxy().getReader(),
                    orignTransform = reader.getTransform();
                reader.setTransform(function (data) {
                    var associations = vm.get('associations');
                    if (data.result && data.result.length > 0) {
                        for (let i = 0; i < data.result.length; i++) {
                            var record = data.result[i];
                            record.assignFlag = !!associations[record.id];
                            record.associationId = associations[record.id];
                        }
                    }
                    data = orignTransform(data);
                    return data;
                });
            },
            goBack: function () {
                var vm = this.getViewModel(), v = this.getView();
                this.getView().fireEvent('goback');
                v.loadEntity(null);
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
