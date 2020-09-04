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
    columns: [],
    itemController: {},
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
        this.extraParams = this.getExtraParams(opt);
        if (callback) {
            callback();
        }
    },
    getExtraParams: function (opt) {
        return {};
    },
    createItemsConfig: function (config) {
        const vThis = this,
            isTree = this.isTree,
            title = this.title,
            updateAction = this.updateAction,
            items = [].concat(this.config.items),
            columns = this.columns,
            itemController = this.itemController;
        let tbcontainer, tbnav, tbsearch, tbeditor, grd, clmns, grdItemController;
        this.config.items = items;
        // 创建工具栏容器
        tbcontainer = {xtype: 'psr-toolbar-topcontainer', items: []};
        // 创建导航工具栏
        tbnav = {xtype: 'toolbar', items: [{xtype: 'psr-button-goback', handler: 'goBack'}]};
        tbcontainer.items.push(tbnav);
        tbcontainer.items.push({xtype: 'container', width: 1});
        // 创建搜索工具栏
        tbsearch = {
            xtype: 'psr-toolbar-search',
            refreshHandler: 'refresh',
            filterHandler: 'filter',
            reference: 'tbsearch'
        };
        tbcontainer.items.push(tbsearch);
        tbcontainer.items.push({xtype: 'container', width: 1});
        // 创建选中项过滤工具栏
        const tbselectionfilter = {
            xtype: 'toolbar',
            items: [{
                xtype: 'segmentedbutton',
                items: [{reference: 'segbtnAll', text: '所有', ui: '', pressed: true},
                    {reference: 'segbtnSelected', text: '已选', ui: ''}],
                listeners: {toggle: 'toggleBtnSelectionFilter'}
            }]
        };
        tbcontainer.items.push(tbselectionfilter);
        tbcontainer.items.push({xtype: 'container', width: 1});
        // 创建编辑工具栏
        tbeditor = {
            xtype: 'psr-toolbar-editor', reference: 'tbeditor',
            flex: 1,
            resetHandler: 'reset',
            bind: {editable: '{action_' + updateAction + '}'}
        };
        tbcontainer.items.push(tbeditor);
        // 创建表格f
        clmns = [{
            xtype: 'psr-grid-column-toggle',
            flagIndex: 'assignFlag',
            disabledBinding: '!tbeditor.editing',
            toggleHandler: 'associate'
        }, {
            xtype: isTree ? 'treecolumn' : 'column',
            text: title, flex: 1, menuDisabled: true,
            dataIndex: 'displaytext',
            cell: {encodeHtml: false},
            renderer: 'filterRenderer'
        }].concat(columns);// 创建表格列
        grdItemController = {
            filterRenderer: function (value) {
                const filterText = vThis.getViewModel().get('tbsearch.filterText');
                return PSR.util.Grid.filterRenderer(value, filterText);
            },
            getListView: function () {
                return vThis;
            },
            associate: function (button) {
                const vm = this.getViewModel(),
                    c = vThis.getController(),
                    record = vm.get('record');
                if (!record.data.assignFlag) {
                    c.create(record);
                } else {
                    c.delete(record);
                }
            }
        };
        grdItemController = Object.assign(grdItemController, itemController);
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
            this.config.viewModel.stores.entities.pageSize = 0;
        }
        items.push(grd);
    },
    createViewModelConfig: function () {
        const viewModel = Object.assign({}, this.config.viewModel),
            actions = this.config.actions;
        this.config.viewModel = viewModel;
        // 组装data
        let data = {text: '', entityId: null, associations: {}};
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
                    associations = vm.get('associations'),
                    association = associations[record.id];
                record.set('assignFlag', !!association);
                if (association) {
                    record.set('associationId', association.id);
                    record.set('association', association);
                } else {
                    record.set('associationId', null);
                    record.set('association', null);
                }
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
                const vm = this.getViewModel(), v = this.getView();
                this.getView().fireEvent('goback', {isNew: false});
                v.load(null);
            },
            reset: function () {
                const vm = this.getViewModel(), v = this.getView();
                this.loadEntity(vm.get('entityId'), vm.get('tbeditor.editing'));
            },
            loadEntity: function (entityId, editing) {
                const me = this,
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
                                const associations = {};
                                if (respObj) {
                                    for (let i = 0; i < respObj.length; i++) {
                                        associations[respObj[i].rightId] = respObj[i];
                                    }
                                }
                                vm.set('associations', associations);
                                me.refresh();
                            },
                            complete: function () {
                                v.unmask();
                            }
                        });
                    } else {
                        me.getService().loadAllByRightId({
                            rightId: entityId,
                            success: function (respObj) {
                                const associations = {};
                                if (respObj) {
                                    for (let i = 0; i < respObj.length; i++) {
                                        associations[respObj[i].leftId] = respObj[i];
                                    }
                                }
                                vm.set('associations', associations);
                                me.refresh();
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
            filter: function () {
                const me = this,
                    searchfield = me.lookup('tbsearch').down('searchfield'),
                    value = searchfield.getValue(),
                    segbtnSelected = me.lookup('segbtnSelected'),
                    pressed = segbtnSelected.getPressed(),
                    vm = me.getViewModel(),
                    store = vm.getStore('entities'),
                    filters = [];
                if (pressed) {
                    filters.push({property: 'assignFlag', value: true});
                }
                if (value) {
                    filters.push(PSR.util.Store.includeTextFilter('displaytext', value));
                }
                PSR.util.Store.filter(store, filters);
            },
            create: function (record) {
                const v = this.getView(),
                    vm = this.getViewModel(),
                    entityId = vm.get('entityId'),
                    associations = vm.get('associations'),
                    association = associations[record.data.id];
                if (!association) {
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
                            record.set('association', resbObj);
                            associations[record.data.id] = resbObj;
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
                const v = this.getView(),
                    vm = this.getViewModel(),
                    associations = vm.get('associations'),
                    association = associations[record.data.id];
                if (association) {
                    v.mask();
                    this.getService().delete({
                        id: association.id,
                        success: function () {
                            record.set('assignFlag', false);
                            record.set('associationId', null);
                            record.set('association', null);
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
            },
            toggleBtnSelectionFilter: function (container, button, pressed) {
                this.filter();
            }
        };
        this.config.controller = Object.assign(controller, this.config.controller);
    }
});
