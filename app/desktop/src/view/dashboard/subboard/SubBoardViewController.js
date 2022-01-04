Ext.define('PortalApp.view.dashboard.SubBoardViewViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboard-subboardviewcontroller',
    beforeRender: function (view) {
        const viewModel = this.getViewModel(),
            subBoardConfigs = view.getSubBoardConfigs();
        this.subBoards = [];
        this.splitters = [];
        if (subBoardConfigs && subBoardConfigs.length > 0) {
            if (subBoardConfigs.length == 1) {
                view.setBoardConfig(subBoardConfigs.boardConfig);
            } else {
                this.appendSubBoard(subBoardConfigs[0]);
                viewModel.set('split', true);
                for (let i = 1; i < subBoardConfigs.length; i++) {
                    this.appendSubBoard(subBoardConfigs[i]);
                }
            }
        }
    },
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        const view = this.getView();
        if (view.rendered) {
            const editing = view.getEditing(),
                subBoards = this.subBoards,
                splitters = this.splitters,
                boardConfig = view.getBoardConfig();
            for (let i = 0; i < subBoards.length; i++) {
                const subPlaceholder = subBoards[i];
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
            this.appendSubBoard({boardConfig: this.getView().getBoardConfig()});
            viewModel.set('split', true);
        }
        this.appendSubBoard();
    },
    hBtnConfig: function (btn) {
        const view = this.getView(),
            editor = view.add({
                xtype: 'dashboard-subboard-editorview',
                boardConfig: view.getBoardConfig(),
                listeners: {
                    save: function (boardConfig) {
                        view.setBoardConfig(JSON.parse(boardConfig));
                        editor.close();
                    }
                }
            }).show();
    },
    hBtnRemove: function () {
        const view = this.getView();
        view.fireEvent('removeme', view);
    },
    appendSubBoard: function (extSubBoardCfg) {
        const me = this,
            view = this.getView(),
            editing = view.getEditing(),
            layout = view.getLayout().type,
            split = this.getViewModel().get('split'),
            subBoardCfg = {
                xtype: 'dashboard-subboardview',
                layout: {
                    type: layout == 'vbox' ? 'hbox' : 'vbox',
                    align: 'stretch',
                },
                editing: editing,
                listeners: {
                    removeme: function (subView) {
                        me.removeSubBoard(subView);
                    }
                }
            };
        if (layout == 'vbox') {
            subBoardCfg.layout.type = 'hbox';
            subBoardCfg.flex = 120;
        } else {
            subBoardCfg.layout.type = 'vbox';
            subBoardCfg.flex = 90;
        }
        Object.assign(subBoardCfg, extSubBoardCfg);
        if (split) {
            this.splitters.push(
                view.insert(view.items.length - 1, {
                    xtype: 'splitter',
                    maskOnDisable: false,
                    collapseOnDblClick: false,
                    height: 1, width: 1
                })
            );
        }
        this.subBoards.push(
            view.insert(view.items.length - 1, subBoardCfg)
        );
    },
    removeSubBoard: function (subBoard) {
        const view = this.getView(),
            subBoardIndex = view.items.indexOf(subBoard);
        if (this.getViewModel().get('split')) {
            if (subBoardIndex == 1) {
                this.splitters.remove(
                    view.remove(view.items.items[subBoardIndex + 1])
                );
            } else {
                this.splitters.remove(
                    view.remove(view.items.items[subBoardIndex - 1])
                );
            }
        }
        this.subBoards.remove(
            view.remove(subBoard)
        );
        if (view.items.length == 3) {
            const lastSubView = view.items.items[1];
            view.setBoardConfig(lastSubView.getBoardConfig());
            this.subBoards.remove(
                view.remove(lastSubView)
            );
            this.getViewModel().set('split', false);
        }
    },
    readBoardConfigTree: function () {
        const subBoards = this.subBoards,
            subBoardConfigs = [];
        for (let i = 0; i < subBoards.length; i++) {
            const subBoard = subBoards[i];
            subBoardConfigs.push(subBoard.readBoardConfigTree());
        }
        return {
            boardConfig: this.getView().getBoardConfig(),
            subBoardConfigs: subBoardConfigs
        };
    }
});
