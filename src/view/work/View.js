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
        this.subViewStack = [];
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
            const stackItem = {view: subView, opt: opt, title: subView.getViewTitle()};
            v.subViewStack.push(stackItem);
            v.setActiveItem(subView);
            if (subView.load) {
                subView.load(opt, function () {
                    stackItem.title = subView.getViewTitle();
                    vm.set('viewTitle', v.getViewTitle());
                });
            } else {
                vm.set('viewTitle', v.getViewTitle());
            }
        }
    },
    goBack: function (opt) {
        const v = this,
            vm = v.getViewModel(),
            subViewStack = v.subViewStack;
        if (subViewStack.length > 1) {
            subViewStack.length = subViewStack.length - 1;
            const stackItem = subViewStack[subViewStack.length - 1],
                subView = stackItem.view,
                newOpt = Object.assign({}, stackItem.opt, opt);
            v.setActiveItem(subView);
            if (subView.load) {
                subView.load(newOpt, function () {
                    stackItem.title = subView.getViewTitle();
                    vm.set('viewTitle', v.getViewTitle());
                });
            } else {
                vm.set('viewTitle', v.getViewTitle());
            }
        }
    },
    getViewTitle: function () {
        const subViewStack = this.subViewStack;
        if (subViewStack && subViewStack.length > 0) {
            let title = subViewStack[0].title;
            for (let i = 1; i < subViewStack.length; i++) {
                title = title + '\\' + subViewStack[i].title;
            }
            return title;
        }
        return '';
    },
    viewModel: {},
    controller: {
        goSubView: function (view, opt) {
            this.getView().goSubView(view, opt);
        },
        goBack: function (opt) {
            this.getView().goBack(opt);
        }
    }
});
