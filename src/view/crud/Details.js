Ext.define('PSR.view.crud.Details', {
    extend: 'PSR.view.work.SubView',
    //****** SubView 配置默认值
    // 视图标题
    viewTitle: '明细',
    // 是否支持返回上一视图操作
    goBack: {isNew: false},
    // 操作
    actions: {
        create: true,
        update: true
    },
    config: {
        formFields: []
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
        this.getViewModel().set('dirty', {isNew: false});
        if (opt && !opt.create && opt.record) {
            this.getController().loadEntity(opt.record.id, null, callback);
        } else {
            this.getController().loadEntity(null, null, callback);
        }
    },
    setValues: function (value) {
        var form = this.down('formpanel');
        if (value) {
            form.setValues(value);
        } else {
            form.reset();
        }
        this.setViewTitle((value ? this.getEntityTitle(value) : '') + '明细');
    },
    getValues: function () {
        var value = this.down('formpanel').getValues({enabled: true});
        return value;
    },
    validate: function () {
        return this.down('formpanel').validate();
    },
    getEntityTitle: function (data) {
        return '';
    },
    createItemsConfig: function (config) {
        const formFields = [].concat(config.formFields || this.config.formFields || []),
            actionPrefix = config.actionPrefix || this.config.actionPrefix;
        //*** 创建工具栏
        const detailsToolbars = [];
        // CRUD工具栏
        tbcrud = {
            xtype: 'psr-toolbar-editor', reference: 'tbeditor',
            resetHandler: 'reset',
            bind: {
                editable: '{action_' + actionPrefix + 'update}',
                createHandler: '{action_' + actionPrefix + 'create ? "create" : null}',
                updateHandler: '{action_' + actionPrefix + 'update ? "update" : null}'
            }
        };
        detailsToolbars.push(tbcrud);
        // 合并工具栏配置
        config.toolbars = detailsToolbars.concat(config.toolbars || this.config.toolbars || []);
        //*** 创建界面元素
        const detailsItems = [];
        // 表单
        const frm = {xtype: 'formpanel', scrollable: 'y', items: formFields};
        detailsItems.push(frm);
        // 合并界面元素配置
        config.items = detailsItems.concat(config.items || this.config.items || []);
        this.callParent([config]);
    },
    createViewModelConfig: function (config) {
        const viewModel = config.viewModel = config.viewModel || {},
            data = viewModel.data = viewModel.data || {};
        this.callParent([config]);
    },
    createControllerConfig: function (config) {
        if (!this.config.controller || !this.config.controller.getService) {
            PSR.Message.error('CRUD视图缺少getService');
        }
        const controller = {
            loadEntity: function (entityId, editing, callback) {
                this.getViewModel();
                var me = this,
                    v = this.getView(),
                    tbeditor = me.lookup('tbeditor');
                v.setValues();
                if (entityId) {
                    if (editing) {
                        tbeditor.toggleEditing();
                    } else {
                        tbeditor.toggleViewing();
                    }
                    v.mask({xtype: 'loadmask', message: '加载中...'});
                    me.getService().findById({
                        id: entityId,
                        success: function (data) {
                            v.setValues(data[0]);
                        },
                        failure: function () {
                            PSR.Message.info("加载失败")
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
                    v.setViewTitle('创建');
                    if (callback) {
                        callback();
                    }
                }
            },
            create: function () {
                const me = this,
                    v = this.getView(),
                    vm = this.getViewModel(),
                    validate = v.validate(),
                    values = v.getValues(),
                    tbeditor = me.lookup('tbeditor'),
                    actionPrefix = v.actionPrefix,
                    action_update = vm.get('action_' + actionPrefix + 'update'),
                    goBackOpt = vm.get('goBack');
                if (!validate) {
                    return;
                }
                v.mask({xtype: 'loadmask', message: '保存中...'});
                me.getService().create({
                    values: values,
                    success: function (data) {
                        if (data) {
                            PSR.Message.info("保存成功");
                            goBackOpt.isNew = true;
                            goBackOpt.record = data;
                            if (action_update) {
                                tbeditor.toggleEditing();
                            } else {
                                tbeditor.toggleViewing();
                            }
                            v.setValues(data);
                        }
                    },
                    failure: function () {
                        PSR.Message.info("保存失败")
                    },
                    complete: function () {
                        v.unmask();
                    }
                });
            },
            update: function () {
                const me = this,
                    v = this.getView(),
                    vm = this.getViewModel(),
                    validate = v.validate(),
                    values = v.getValues(),
                    goBackOpt = vm.get('goBack'),
                    props = [];
                if (!validate) {
                    return;
                }
                for (const valuesKey in values) {
                    props.push(valuesKey);
                }
                v.mask({xtype: 'loadmask', message: '保存中...'});
                me.getService().patch({
                    props: props,
                    values: values,
                    success: function (data) {
                        if (data) {
                            PSR.Message.info("保存成功");
                            goBackOpt.record = data;
                            v.setValues(data);
                        }
                    },
                    failure: function () {
                        PSR.Message.info("保存失败")
                    },
                    complete: function () {
                        v.unmask();
                    }
                });
            },
            reset: function () {
                var vm = this.getViewModel(), v = this.getView();
                this.loadEntity(v.getValues().id, vm.get('tbeditor.editing'));
            }
        };
        config.controller = Object.assign(controller, config.controller);
        this.callParent([config]);
    }
});
