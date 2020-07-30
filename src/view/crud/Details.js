Ext.define('PSR.view.crud.Details', {
    extend: 'Ext.Container',
    layout: 'fit',
    items: [],
    controller: {},
    viewModel: {},
    isViewClassInit: false,
    // 抽象成员
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
    loadEntity: function (record) {
        this.getController().loadEntity(record ? record.data.id : null);
        this.getViewModel().set('text', record ? record.get('displaytext') : '');
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
            tbtitle, tbcontainer, tbeditor, frm;
        this.config.items = items;
        // 创建表单
        frm = {xtype: 'formpanel', scrollable: 'y', items: formFields};
        items.push(frm);
        // 创建标题
        tbtitle = {xtype: 'psr-toolbar-navigation', bind: {title: '明细: {text}'}, goBackHandler: 'goBack'};
        items.push(tbtitle);
        // 创建工具栏容器
        tbcontainer = {xtype: 'psr-toolbar-topcontainer', items: []};
        items.push(tbcontainer);
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
            loadEntity: function (entityId, editing) {
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
                            v.setValues(data);
                        },
                        failure: function () {
                            Ext.toast("加载失败")
                            me.goBack();
                        },
                        complete: function () {
                            v.unmask();
                        }
                    });
                } else {
                    tbeditor.toggleCreating();
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
                v.loadEntity(null);
            },
            reset: function () {
                var vm = this.getViewModel(), v = this.getView();
                this.loadEntity(v.getValues().id, vm.get('tbeditor.editing'));
            }
        };
        this.config.controller = Object.assign(controller, this.config.controller);
    }
});
