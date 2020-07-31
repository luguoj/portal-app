Ext.define('PSR.view.work.View', {
    extend: 'Ext.Container',
    layout: {type: 'card', animation: 'fade'},
    // 成员属性
    subViewConfigs: {},
    config: {
        actions: {}
    },
    constructor: function (config) {
        this.callParent([config]);
        this.goSubView('main')
    },
    goSubView: function (view, opt) {
        const v = this,
            vm = v.getViewModel(),
            subView = v.getComponent(view);
        if (!subView) {
            const actions = v.getActions(),
                subViewConfigs = v.subViewConfigs,
                subViewConfig = Object.assign({itemId: view, actions: actions, listeners: {}}, subViewConfigs[view]);
            subViewConfig.listeners.goback = 'goBack';
            PSR.clientSite.ClientSite.addModuleItem(
                subViewConfig.moduleId,
                subViewConfig,
                v,
                function (item) {
                    v.goSubView(view, opt);
                });
        } else {
            v.topView = subView;
            v.setActiveItem(subView);
            if (subView.load) {
                subView.load(opt, function () {
                    vm.set('viewTitle', v.topView.title);
                });
            } else {
                vm.set('viewTitle', v.topView.title);
            }
        }
    },
    viewModel: {},
    controller: {
        goBack: function (opt) {
            this.getView().goSubView('main', opt);
        }
    }
});
