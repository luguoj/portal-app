Ext.define('PortalApp.view.dashboard.DashboardViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboard-dashboardviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        const view = this.getView();
        if (view.rendered) {
            const editing = view.getEditing(),
                mainPartTemplate = view.getMainPart();
            if (this.mainPart) {
                view.remove(this.mainPart);
                delete this.mainPart;
            }
            const mainPartCfg = {
                xtype: 'dashboard-partview',
                height: '100%',
                editing: editing,
                splitting: this.splitting,
                resizable: editing ? {
                    handles: 's'
                } : false
            };
            if (mainPartTemplate) {
                Object.assign(mainPartCfg, mainPartTemplate);
            }
            this.mainPart = view.add(Ext.create(mainPartCfg));
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    hBtnEdit: function (btn, pressed) {
        this.getView().setEditing(pressed);
    },
    genTemplate: function () {
        const template = this.mainPart.genTemplate();
        if (this.mainPart.style) {
            template.style = this.mainPart.style;
        }
        if (this.mainPart.padding) {
            template.padding = this.mainPart.padding;
        }
        template.partLayout = this.mainPart.getPartLayout();
        if (this.mainPart.height != '100%') {
            template.height = this.mainPart.getHeight();
        }
        return template;
    },
    hBtnTrans: function () {
        const template = this.genTemplate();
        template.partLayout = template.partLayout == 'vbox' ? 'hbox' : 'vbox';
        template.editing = this.getView().getEditing();
        template.splitting = this.splitting;
        this.getView().setMainPart(template);
    },
    hBtnSplitting: function (btn, pressed) {
        this.splitting = pressed;
        if (this.mainPart) {
            this.mainPart.setSplitting(pressed);
        }
    },
    hBtnAutoHeight: function () {
        const mainPart = this.mainPart;
        mainPart.setHeight('100%');
        mainPart.height = '100%';
    },
    hBtnSave: function () {
        this.getView().fireEvent('save', this.genTemplate());
    },
    hBtnImport: function () {
        const me = this,
            dialog = PSR.Dialog.upload({
                accept: '.dashboardconfig',
                uploadHandler: function (file) {
                    PSR.util.LocalFile.read(
                        file,
                        function (data) {
                            const template = JSON.parse(PSR.util.Base64.decode(data));
                            me.getView().setMainPart(template);
                            dialog.close();
                        },
                        true
                    );
                }
            });
    },
    hBtnExport: function () {
        const title = this.getView().getTitle(),
            template = this.genTemplate();
        PSR.util.LocalFile.write(
            title + ".dashboardconfig",
            PSR.util.Base64.encode(JSON.stringify(template))
        );
    },
});
