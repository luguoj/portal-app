Ext.define('PortalApp.view.dashboard.PlaceholderViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboard-placeholderviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        const view = this.getView();
        if (view.rendered) {
            const editing = view.getEditing(),
                layout = view.getLayout().type,
                subPlaceholders = view.query('dashboard-placeholderview'),
                splitters = view.query('splitter'),
                boardConfig = view.getBoardConfig();
            for (let i = 0; i < subPlaceholders.length; i++) {
                const subPlaceholder = subPlaceholders[i];
                subPlaceholder.setEditing(editing);
            }
            for (let i = 0; i < splitters.length; i++) {
                const splitter = splitters[i];
                splitter.setDisabled(!editing);
            }
            const ctContent = this.lookup('ctContent');
            ctContent.removeAll();
            if (boardConfig) {
                ctContent.add(boardConfig);
            }
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    hBtnAdd: function () {
        const viewModel = this.getViewModel();
        if (!viewModel.get('split')) {
            this.lookup('ctContent').removeAll();
            this.appendSubView(this.getView().getBoardConfig());
            viewModel.set('split', true);
        }
        this.appendSubView();
    },
    hBtnConfig: function (btn) {
        this.getView().setBoardConfig({
            html: '12345'
        });
    },
    hBtnSplit: function () {
        this.lookup('ctContent').removeAll();
        this.appendSubView(this.getView().getBoardConfig());
        this.getViewModel().set('split', true);
        this.appendSubView();
    },
    hBtnRemove: function () {
        const view = this.getView();
        view.fireEvent('removeme', view);
    },
    appendSubView: function (boardConfig) {
        const me = this,
            view = this.getView(),
            layout = view.getLayout().type,
            split = this.getViewModel().get('split'),
            subViewOpt = {
                xtype: 'dashboard-placeholderview',
                layout: {
                    type: layout == 'vbox' ? 'hbox' : 'vbox',
                    align: 'stretch',
                },
                editing: true,
                boardConfig: boardConfig,
                listeners: {
                    removeme: function (subView) {
                        me.removeSubView(subView);
                    }
                }
            };
        if (layout == 'vbox') {
            subViewOpt.layout.type = 'hbox';
            subViewOpt.flex = 120;
        } else {
            subViewOpt.layout.type = 'vbox';
            subViewOpt.flex = 90;
        }
        if (split) {
            view.insert(view.items.length - 1, {
                xtype: 'splitter',
                maskOnDisable: false,
                collapseOnDblClick: false,
                height: 1, width: 1
            });
        }
        view.insert(view.items.length - 1, subViewOpt);
    },
    removeSubView: function (subView) {
        const view = this.getView(),
            subViewIndex = view.items.indexOf(subView);
        if (this.getViewModel().get('split')) {
            if (subViewIndex == 1) {
                view.remove(view.items.items[subViewIndex + 1]);
            } else {
                view.remove(view.items.items[subViewIndex - 1]);
            }
        }
        view.remove(subView)
        if (view.items.length == 3) {
            const lastSubView = view.items.items[1];
            view.setBoardConfig(lastSubView.getBoardConfig());
            view.remove(lastSubView);
            this.getViewModel().set('split', false);
        }
    }
});
