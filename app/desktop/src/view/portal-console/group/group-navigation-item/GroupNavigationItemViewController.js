Ext.define('PortalApp.view.portalConsole.group.GroupNavigationItemViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-group-groupnavigationitemviewcontroller',
    onCombPortalChange: function (comb, newValue) {
        this.getViewModel().set('portalId', newValue);
        this.getView().down('treepanel').setDisabled(false);
        this.getStore('navigationItemTree').addFilter(
            {
                property: 'portalId',
                operator: '==',
                value: newValue
            }, true);
        this.loadData();
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    loadData: function () {
        this.getStore('groupNavigationItems').addFilter(
            {
                property: 'groupId',
                operator: '==',
                value: this.getViewModel().get('group').get('id')
            }
        );
        this.getStore('navigationItemTree').load();
        this.getStore('groupNavigationItems').load();
    },
    onDataLoad: function () {
        const navigationItemTreeStore = this.getStore('navigationItemTree'),
            groupNavigationItemStore = this.getStore('groupNavigationItems');
        if (navigationItemTreeStore.isLoaded() && groupNavigationItemStore.isLoaded()) {
            const grantMap = {};
            for (let i = 0; i < groupNavigationItemStore.getData().items.length; i++) {
                const groupNavigationItem = groupNavigationItemStore.getData().items[i];
                grantMap[groupNavigationItem.get('navigationItemId')] = groupNavigationItem;
            }
            for (const byIdMapKey in navigationItemTreeStore.byIdMap) {
                navigationItemTreeStore.byIdMap[byIdMapKey].set('granted', grantMap[byIdMapKey]);
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
                domainType: 'org.psr.platform.portal.entity.GroupNavigationItemEntity',
                ids: [record.get('granted').id],
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            });
        } else {
            PortalApp.data.api.entity.EntityCRUDApi.create({
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.GroupNavigationItemEntity',
                values: {
                    groupId: group.get('id'),
                    navigationItemId: record.get('id')
                },
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            });
        }
    }
});