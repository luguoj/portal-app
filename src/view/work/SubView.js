Ext.define('PSR.view.work.SubView', {
    extend: 'Ext.Container',
    config: {
        // 视图标题
        viewTitle: '',
        // 操作权限前缀
        actionPrefix: '',
        // 操作权限
        actions: {},
        // 顶部工具栏
        toolbars: [],
        // 是否支持返回上一视图操作
        goBack: false
    },
    layout: 'fit',
    load: function (opt, callback) {
        if (callback) {
            callback();
        }
    },
    constructor: function (config) {
        this.createItemsConfig(config);
        this.createViewModelConfig(config);
        this.createControllerConfig(config);
        this.callParent([config]);
    },
    createItemsConfig: function (config) {
        const goBack = config.goBack || this.config.goBack;
        let toolbars = [].concat(config.toolbars || this.config.toolbars || []),
            items = [].concat(config.items || this.config.items || []);
        // 创建导航工具栏
        if (goBack) {
            const navtoolbar = {
                xtype: 'toolbar',
                items: [{xtype: 'psr-button-goback', handler: 'goBack'}]
            };
            toolbars = [navtoolbar].concat(toolbars);
        }
        // 创建工具栏区域
        if (toolbars.length > 0) {
            const tbcontainer = {xtype: 'psr-toolbar-topcontainer', items: [toolbars[0]]};
            toolbars[toolbars.length - 1].flex = 1;
            for (let i = 1; i < toolbars.length; i++) {
                tbcontainer.items.push({xtype: 'container', width: 1}, toolbars[i]);
            }
            items = [tbcontainer].concat(items);
        }
        config.items = items;
    },
    createViewModelConfig: function (config) {
        const actions = config.actions = Object.assign({}, this.config.actions, config.actions),
            goBack = config.goBack || this.config.goBack,
            viewModel = config.viewModel || {},
            formulas = viewModel.formulas = viewModel.formulas || {},
            data = viewModel.data = viewModel.data || {};
        // 组装data
        data.goBack = goBack ? goBack : false;
        if (actions) {
            for (var actionsKey in actions) {
                data['action_' + actionsKey] = actions[actionsKey];
            }
        }
    },
    createControllerConfig: function (config) {
        const controller = {
            goBack: function () {
                const v = this.getView(), vm = this.getViewModel(), goBackOpt = vm.get('goBack');
                v.fireEvent('goback', goBackOpt);
                v.load(null);
            }
        };
        config.controller = Object.assign(controller, config.controller);
    }
});
