Ext.define('PortalApp.view.portalConsole.group.DashboardTemplateViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-group-dashboardtemplateviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        if (this.getView().rendered) {
            const viewModel = this.getViewModel(),
                portalId = viewModel.get('portalId'),
                groupId = viewModel.get('group').get('id');
            if (portalId && groupId) {
                this.getStore('dashboardTemplateTree').addFilter(
                    {
                        property: 'portalId',
                        operator: '==',
                        value: portalId
                    }, true);
                this.getStore('dashboardTemplateTree').load();
                this.getStore('groupDashboardTemplates').addFilter(
                    {
                        property: 'groupId',
                        operator: '==',
                        value: this.getViewModel().get('group').get('id')
                    }, true);
                this.getStore('groupDashboardTemplates').load();
            }
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    onCombPortalChange: function (comb, newValue) {
        this.getViewModel().set('portalId', newValue);
        this.loadData();
    },
    onDataLoad: function () {
        const dashboardTemplateTreeStore = this.getStore('dashboardTemplateTree'),
            groupDashboardTemplatesStore = this.getStore('groupDashboardTemplates');
        if (dashboardTemplateTreeStore.isLoaded() && groupDashboardTemplatesStore.isLoaded()) {
            const grantMap = {};
            for (let i = 0; i < groupDashboardTemplatesStore.getData().items.length; i++) {
                const groupNavigationItem = groupDashboardTemplatesStore.getData().items[i];
                grantMap[groupNavigationItem.get('dashboardTemplateId')] = groupNavigationItem;
            }
            for (const byIdMapKey in dashboardTemplateTreeStore.byIdMap) {
                dashboardTemplateTreeStore.byIdMap[byIdMapKey].set('granted', grantMap[byIdMapKey]);
            }
        }
    },
    hBtnEnable: function (btn) {
        const me = this,
            group = this.getViewModel().get('group'),
            record = btn.lookupViewModel().get('record');
        if (record.get('granted')) {
            PortalApp.data.api.entity.EntityCRUDApi.delete({
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.GroupDashboardTemplateEntity',
                ids: [record.get('granted').id],
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            });
        } else {
            PortalApp.data.api.entity.EntityCRUDApi.create({
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.GroupDashboardTemplateEntity',
                values: {
                    groupId: group.get('id'),
                    dashboardTemplateId: record.get('id')
                },
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            });
        }
    }
});
