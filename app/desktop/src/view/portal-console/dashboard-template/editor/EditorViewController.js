Ext.define('PortalApp.view.portalConsole.dashboardTemplate.EditorViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-dashboardtemplate-editorviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        if (this.getView().rendered) {
            const dashboardTemplate = this.getViewModel().get('dashboardTemplate'),
                dashboardConfigValue = dashboardTemplate.get('config');
            this.initDashboard(dashboardConfigValue ? JSON.parse(dashboardConfigValue) : null);
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    hBtnSave: function () {
        const view = this.getView(),
            board = view.down('dashboard-subboardview'),
            dashboardTemplate = this.getViewModel().get('dashboardTemplate'),
            boardConfig = board.readBoardConfigTree();
        if (board.height != '100%') {
            boardConfig.height = board.getHeight();
        }
        PortalApp.data.api.entity.EntityCRUDApi.patch({
            application: 'portal',
            domainType: 'org.psr.platform.portal.entity.DashboardTemplateEntity',
            fields: ['config'],
            values: {
                id: dashboardTemplate.get('id'),
                version: dashboardTemplate.get('version'),
                config: JSON.stringify(boardConfig)
            },
            success: function (data) {
                PSR.util.Message.info('保存成功');
                dashboardTemplate.set('version', data.version);
                view.fireEvent('save', data);
            }
        });
    },
    hBtnImport: function () {
        const me = this,
            dialog = PSR.Dialog.upload({
                accept: '.dashboardconfig',
                uploadHandler: function (file) {
                    PSR.util.LocalFile.read(
                        file,
                        function (data) {
                            const boardConfigs = JSON.parse(PSR.util.Base64.decode(data));
                            me.initDashboard(boardConfigs);
                            dialog.close();
                        },
                        true
                    );
                }
            });
    },
    hBtnExport: function () {
        const board = this.getView().down('dashboard-subboardview'),
            dashboardTemplate = this.getViewModel().get('dashboardTemplate');
        PSR.util.LocalFile.write(
            dashboardTemplate.get('code') + ".dashboardconfig",
            PSR.util.Base64.encode(
                JSON.stringify(board.readBoardConfigTree())
            )
        );
    },
    hBtnAutoHeight: function () {
        const board = this.getView().down('dashboard-subboardview');
        board.setHeight('100%');
        board.height = '100%';
    },
    initDashboard: function (config) {
        const view = this.getView(),
            dashboardConfig = {
                xtype: 'dashboard-subboardview',
                height: '100%',
                resizable: {
                    handles: 's'
                },
                editing: true
            };
        view.remove(view.down('dashboard-subboardview'));
        if (config) {
            if (config.height) {
                dashboardConfig.height = config.height;
            }
            dashboardConfig.boardConfig = config.boardConfig;
            dashboardConfig.subBoardConfigs = config.subBoardConfigs;
        }
        view.add(dashboardConfig);
    }
});
