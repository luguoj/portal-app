Ext.define('PSR.view.crud.Details', {
    extend: 'Ext.Container',
    layout: 'fit',
    items: [],
    controller: {},
    viewModel: {},
    isViewClassInit: false,
    // 抽象成员
    title: '明细',
    formFields: [],
    actionToolbars: [],
    config: {
        actions: {
            create: true,
            update: true
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
    /**
     * @description 如果传入记录，则加载显示记录明细<br/>
     * 如果传入null或{record:null}或{create:true},则清空记录，切换到创建模式<br/>
     *
     * @author ZHOUDD
     * @date 2020/8/3
     */
    load: function (opt, callback) {
        const me = this;
        if (opt && !opt.create && opt.record) {
            this.getController().loadEntity(opt.record.id, null, callback);
        } else {
            this.getController().loadEntity(null, null, callback);
        }
    },
    setValues: function (value) {
        var form = this.down('formpanel');
        if (value) {
            value.catalogId = value.catalog ? value.catalog.id : null;
            form.setValues(value);
        } else {
            form.reset();
        }
    },
    getValues: function () {
        var value = this.down('formpanel').getValues();
        return value;
    },
    createItemsConfig: function () {
        var formFields = this.formFields,
            actionToolbars = this.actionToolbars,
            items = [].concat(this.config.items),
            tbcontainer, tbnav, tbeditor, frm;
        this.config.items = items;
        // 创建表单
        frm = {xtype: 'formpanel', scrollable: 'y', items: formFields};
        items.push(frm);
        // 创建工具栏容器
        tbcontainer = {xtype: 'psr-toolbar-topcontainer', items: []};
        items.push(tbcontainer);
        // 创建导航工具栏
        tbnav = {xtype: 'toolbar', items: [{xtype: 'psr-button-goback', handler: 'goBack'}]};
        tbcontainer.items.push(tbnav);
        tbcontainer.items.push({xtype: 'container', width: 1});
        // 创建编辑工具栏
        tbeditor = {
            xtype: 'psr-toolbar-editor', reference: 'tbeditor',
            resetHandler: 'reset',
            bind: {
                editable: '{action_update}',
                createHandler: '{action_create ? "create" : null}',
                updateHandler: '{action_update ? "update" : null}'
            }
        };
        tbcontainer.items.push(tbeditor);
        // 创建操作工具栏
        if (!actionToolbars || actionToolbars.length == 0) {
            tbeditor.flex = 1;
        } else {
            for (var i = 0; i < actionToolbars.length; i++) {
                tbcontainer.items.push({xtype: 'container', width: 1});
                tbcontainer.items.push(actionToolbars[i]);
            }
        }
    },
    createViewModelConfig: function () {
        var viewModel = Object.assign({}, this.config.viewModel),
            data,
            actions = this.config.actions;
        this.config.viewModel = viewModel;
        // 组装data
        data = {text: '', dirty: false};
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
        var controller = {
            loadEntity: function (entityId, editing, callback) {
                var me = this,
                    v = this.getView(),
                    vm = this.getViewModel(),
                    tbeditor = me.lookup('tbeditor');
                v.setValues();
                vm.set('dirty', false);
                if (entityId) {
                    if (editing) {
                        tbeditor.toggleEditing();
                    } else {
                        tbeditor.toggleViewing();
                    }
                    v.mask({xtype: 'loadmask', message: '加载中...'});
                    me.getService().load({
                        id: entityId,
                        success: function (data) {
                            v.title = '明细';
                            v.setValues(data);
                        },
                        failure: function () {
                            Ext.toast("加载失败")
                            me.goBack();
                        },
                        complete: function () {
                            v.unmask();
                            if (callback) {
                                callback();
                            }
                        }
                    });
                } else {
                    tbeditor.toggleCreating();
                    v.title = '创建';
                    if (callback) {
                        callback();
                    }
                }
            },
            create: function () {
                const me = this,
                    v = this.getView(),
                    vm = this.getViewModel(),
                    values = v.getValues(),
                    tbeditor = me.lookup('tbeditor'),
                    action_update = vm.get('action_update');
                v.mask({xtype: 'loadmask', message: '保存中...'});
                me.getService().create({
                    values: values,
                    success: function (data) {
                        if (data) {
                            Ext.toast("保存成功");
                            vm.set('dirty', true);
                            if (action_update) {
                                tbeditor.toggleEditing();
                            } else {
                                tbeditor.toggleViewing();
                            }
                            v.setValues(data);
                        }
                    },
                    failure: function () {
                        Ext.toast("保存失败")
                    },
                    complete: function () {
                        v.unmask();
                    }
                });
            },
            update: function () {
                var me = this,
                    v = this.getView(),
                    vm = this.getViewModel(),
                    values = v.getValues(),
                    tbeditor = me.lookup('tbeditor');
                v.mask({xtype: 'loadmask', message: '保存中...'});
                me.getService().update({
                    values: values,
                    success: function (data) {
                        if (data) {
                            Ext.toast("保存成功");
                            vm.set('dirty', data);
                            v.setValues(data);
                        }
                    },
                    failure: function () {
                        Ext.toast("保存失败")
                    },
                    complete: function () {
                        v.unmask();
                    }
                });
            },
            goBack: function () {
                var vm = this.getViewModel(), v = this.getView();
                this.getView().fireEvent('goback', vm.get('dirty'));
                v.load(null);
            },
            reset: function () {
                var vm = this.getViewModel(), v = this.getView();
                this.loadEntity(v.getValues().id, vm.get('tbeditor.editing'));
            }
        };
        this.config.controller = Object.assign(controller, this.config.controller);
    }
});
