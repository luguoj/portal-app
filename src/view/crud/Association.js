Ext.define('PSR.view.crud.Association', {
    extend: 'PSR.view.work.SubView',
    //****** SubView 配置默认值
    // 视图标题
    viewTitle: '关系',
    // 是否支持返回上一视图操作
    goBack: {},
    // 操作
    actions: {
        updateAssociation: true
    },
    //****** Association 配置
    config: {
        // 关系标题
        associationTitle: '关系',
        // 是否树形清单
        isTree: false,
        // 实体所属侧
        entitySide: 'left',
        // 数据列
        columns: [],
        // 操作列
        actionColumns: [],
        // 清单元素Controller
        itemController: {},
        // 更新操作
        updateAction: 'association_update',
    },
    load: function (opt, callback) {
        if (opt && opt.record) {
            this.getController().loadEntity(opt.record.id);
            this.setViewTitle(this.getEntityTitle(opt.record) + this.getAssociationTitle());
        } else {
            this.getController().loadEntity(null);
            this.setViewTitle(this.getAssociationTitle());
        }
        this.extraParams = this.getExtraParams(opt);
        if (callback) {
            callback();
        }
    },
    getExtraParams: function (opt) {
        return {};
    },
    getEntityTitle: function (data) {
        return '';
    },
    createItemsConfig: function (config) {
        const vThis = this,
            actionPrefix = config.actionPrefix || this.config.actionPrefix,
            isTree = config.isTree || this.config.isTree,
            columns = [].concat(config.columns || this.config.columns || []),
            actionColumns = [].concat(config.actionColumns || this.config.actionColumns || []),
            configItemController = Object.assign({}, this.config.itemController, config.itemController),
            title = config.viewTitle || this.config.viewTitle,
            updateAction = config.updateAction || this.config.updateAction;

        //*** 创建工具栏
        const listToolbars = [];
        // 搜索工具栏
        const tbsearch = {
            xtype: 'psr-toolbar-search',
            refreshHandler: 'refresh',
            filterHandler: 'filter',
            reference: 'tbsearch'
        };
        listToolbars.push(tbsearch);
        // 选中项过滤工具栏
        const tbselectionfilter = {
            xtype: 'toolbar',
            items: [{
                xtype: 'segmentedbutton',
                items: [{reference: 'segbtnAll', text: '所有', ui: '', pressed: true},
                    {reference: 'segbtnSelected', text: '已选', ui: ''}],
                listeners: {toggle: 'toggleBtnSelectionFilter'}
            }]
        };
        listToolbars.push(tbselectionfilter);
        // 编辑工具栏
        tbeditor = {
            xtype: 'psr-toolbar-editor', reference: 'tbeditor',
            flex: 1,
            resetHandler: 'reset',
            bind: {editable: '{action_' + updateAction + '}'}
        };
        listToolbars.push(tbeditor);
        // 合并工具栏配置
        config.toolbars = listToolbars.concat(config.toolbars || this.config.toolbars || []);
        //*** 创建界面元素
        const listItems = [];
        // 清单表格
        const grdColumn = [{
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
            }].concat(columns),
            grdItemController = {
                filterRenderer: function (value) {
                    const filterText = vThis.getViewModel().get('tbsearch.filterText');
                    return PSR.util.Grid.filterRenderer(value, filterText);
                },
                getListView: function () {
                    return vThis;
                },
                goDetails: function (record) {
                    vThis.getController().fireActionEvent('go_details', record);
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
            },
            grd = {
                reference: 'grd',
                rowLines: true, columnLines: true,
                columns: grdColumn,
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
        // 组装data
        const viewModel = config.viewModel = config.viewModel || {},
            data = viewModel.data = viewModel.data || {};
        data.entityId = null;
        data.associations = {};
        this.callParent([config]);
    },
    createControllerConfig: function (config) {
        const entitySide = config.entitySide || this.config.entitySide,
            actionPrefix = config.actionPrefix || this.config.actionPrefix,
            actionColumns = [].concat(config.actionColumns || this.config.actionColumns || []),
            configController = Object.assign({}, this.config.controller, config.controller);
        if (!this.config.controller || !this.config.controller.getService) {
            PSR.Message.error('CRUD视图缺少getService');
        }
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
                        me.getService().searchByLeftId({
                            leftId: entityId,
                            success: function (respObj) {
                                const associations = {},
                                    datas = respObj && respObj.content ? respObj.content : [];
                                for (let i = 0; i < datas.length; i++) {
                                    associations[datas[i].rightId] = datas[i];
                                }
                                vm.set('associations', associations);
                                me.refresh();
                            },
                            complete: function () {
                                v.unmask();
                            }
                        });
                    } else {
                        me.getService().searchByRightId({
                            rightId: entityId,
                            success: function (respObj) {
                                const associations = {},
                                    datas = respObj && respObj.content ? respObj.content : [];
                                for (let i = 0; i < datas.length; i++) {
                                    associations[datas[i].leftId] = datas[i];
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
                    PSR.util.Store.filterValue(store, 'assignFlag', true);
                } else {
                    PSR.util.Store.filterValue(store, 'assignFlag');
                }
                PSR.util.Store.filterText(store, 'displaytext', value);
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
