Ext.define('PSR.panel.crud.details.Base', {
    extend: 'Ext.Container',
    xtype: 'psr-panel-crud-details',
    controller: {
        initViewModel: function (vm) {
            var pages = this.getView().getPages(),
                store = vm.getStore('pageSelections'),
                pageSelections = [];
            for (var i = 0; i < pages.length; i++) {
                pageSelections.push({text: pages[i].pageName, value: i, id: i});
            }
            store.loadData(pageSelections);
        },
        hBtnGoback: function () {
            var vm = this.getViewModel();
            vm.set('editing', false);
            vm.set('creating', false);
            this.getView().fireEvent('goback', this.getViewModel().get('dataChanged'));
        },
        hBtnModify: function () {
            var vm = this.getViewModel();
            vm.set('editing', true);
            vm.set('creating', false);
        },
        hBtnSave: function () {
            var c = this, v = this.getView(), vm = this.getViewModel();
            v.mask({xtype: 'loadmask', message: '保存中...'});
            if (vm.get('creating')) {
                // 增加服务
                v.getApi().create({
                    values: c.getValues(),
                    success: function (respObj) {
                        Ext.toast("保存成功")
                        vm.set('dataChanged', true);
                        if (respObj) {
                            c.loadRecord(respObj.id, true);
                        } else {
                            c.hBtnGoback();
                        }
                    },
                    failure: function () {
                        Ext.toast("保存失败")
                    },
                    complete: function () {
                        v.unmask();
                    }
                });
            } else {
                // 修改服务
                v.getApi().update({
                    values: c.getValues(),
                    success: function (respObj) {
                        Ext.toast("保存成功")
                        vm.set('dataChanged', true);
                    },
                    failure: function () {
                        Ext.toast("保存失败");
                    },
                    complete: function () {
                        v.unmask();
                    }
                });
            }
        },
        hBtnRefresh: function () {
            this.loadRecord(this.getView().recordId);
        },
        loadRecord: function (id, editing) {
            var c = this, v = this.getView(), vm = this.getViewModel();
            c.setValues({});
            vm.set('editing', !!editing);
            vm.set('creating', false);
            if (id) {
                v.mask({xtype: 'loadmask', message: '加载中...'});
                // 加载服务
                v.getApi().load({
                    id: id,
                    success: function (data) {
                        c.setValues(data);
                    },
                    failure: function () {
                        Ext.toast("加载失败")
                        c.hBtnGoback();
                    },
                    complete: function () {
                        v.unmask();
                    }
                });
            }
        },
        createRecord: function () {
            var vm = this.getViewModel();
            this.setValues({});
            vm.set('editing', true);
            vm.set('creating', true);
        },
        copyRecord: function (id) {
            var c = this, v = this.getView(), vm = this.getViewModel();
            c.setValues({});
            vm.set('editing', true);
            vm.set('creating', true);
            if (id) {
                v.mask({xtype: 'loadmask', message: '加载中...'});
                // 加载服务
                v.getApi().load({
                    id: id,
                    success: function (data) {
                        data.id = null;
                        c.setValues(data);
                    },
                    failure: function () {
                        Ext.toast("加载失败")
                        c.hBtnGoback();
                    },
                    complete: function () {
                        v.unmask();
                    }
                });
            }
        },
        getValues: function () {
            var detailsPages = this.getView().pages;
            var values = {};
            for (var i = 0; i < detailsPages.length; i++) {
                var page = detailsPages[i];
                Object.assign(values, page.getAltValues());
            }
            return values;
        },
        setValues: function (values) {
            var vm = this.getViewModel(), detailsPages = this.getView().pages;
            for (var i = 0; i < detailsPages.length; i++) {
                var page = detailsPages[i];
                var pageValues = page.getAltValues();
                for (var field in pageValues) {
                    pageValues[field] = values && values[field] != undefined ? (values[field]) : null;
                }
                page.setAltValues(pageValues);
            }
        }
    },
    viewModel: {
        data: {
            editing: false,
            currentPage: 0,
            creating: false,
            dataChanged: false,
        },
        stores: {
            pageSelections: {
                data: []
            }
        },
    },
    layout: 'fit',
    config: {
        api: null,
        pages: [],
        actionMenus: []
    },
    loadRecord: function (id) {
        if (id) {
            this.recordId = id;
        } else {
            this.recordId = '';
        }
        this.getViewModel().set('dataChanged', false);
        this.getController().loadRecord(this.recordId);
    },
    createRecord: function () {
        this.getController().createRecord();
    },
    copyRecord: function (id) {
        this.getController().copyRecord(id)
    },
    constructor: function (config) {
        this.callParent([config]);

        this.add(this.createToolbar());
        var pageCard = this.add({
            bind: {activeItem: '{currentPage}'},
            layout: 'card',
        });
        this.pages = pageCard.add(this.createPages());
    },
    createToolbar: function () {
        var toolItems = [];
        toolItems.push({
            text: '返回', iconCls: 'x-fa fa-arrow-left',
            handler: 'hBtnGoback'
        }, {
            xtype: 'combobox',
            editable: false,
            queryMode: 'local',
            bind: {
                store: '{pageSelections}',
                value: '{currentPage}'
            }
        }, '->');
        if (this.getActionMenus() != null && this.getActionMenus().length > 0) {
            toolItems.push({
                xtype: 'button',
                text: '操作',
                iconCls: 'x-fa fa-bars',
                menu: this.getActionMenus(),
                bind: {
                    hidden: '{creating}'
                }
            });
        }
        toolItems.push({
            xtype: 'button',
            text: '修改',
            iconCls: 'x-fa fa-edit',
            handler: 'hBtnModify',
            bind: {
                hidden: '{editing}'
            }
        }, {
            xtype: 'button',
            text: '创建',
            iconCls: 'x-fa fa-plus',
            handler: 'hBtnSave',
            bind: {
                hidden: '{!creating}'
            }
        }, {
            xtype: 'button',
            text: '保存',
            iconCls: 'x-fa fa-save',
            handler: 'hBtnSave',
            bind: {
                hidden: '{!editing || creating}'
            }
        }, {
            xtype: 'button',
            text: '刷新',
            iconCls: 'x-fa fa-sync',
            handler: 'hBtnRefresh'
        });
        return {
            xtype: 'toolbar',
            docked: 'top',
            items: toolItems
        };
    },
    createPages: function () {
        var pages = this.getPages();
        var _pages = [];
        for (var i = 0; i < pages.length; i++) {
            var page = Object.assign({
                xtype: 'formpanel',
                scrollable: 'y',
                pageName: 'page ' + i,
                defaults: {
                    bind: {disabled: '{!editing}'},
                    defaults: {
                        bind: {disabled: '{!editing}'}
                    },
                },
                getAltValues: function () {
                    return this.getValues();
                },
                setAltValues: function (values) {
                    this.setValues(values);
                }
            }, pages[i]);
            _pages[i] = page;
        }
        return _pages;
    }
});
