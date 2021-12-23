Ext.define('PortalApp.view.authorizationConsole.authority.GroupViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authorizationconsole-authority-groupviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        if (this.getView().rendered) {
            const groupTreeStore = this.getStore('groupTree'),
                groupAuthorityStore = this.getStore('groupAuthorities'),
                authority = this.getViewModel().get('authority');
            if (authority) {
                groupTreeStore.load();
                groupAuthorityStore.addFilter({
                    property: 'authorityId',
                    operator: '==',
                    value: authority.get('id')
                }, true);
                groupAuthorityStore.load();
            }
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    onDataLoad: function () {
        const groupTreeStore = this.getStore('groupTree'),
            groupAuthorityStore = this.getStore('groupAuthorities');
        if (groupTreeStore.isLoaded() && groupAuthorityStore.isLoaded()) {
            const grantMap = {};
            for (let i = 0; i < groupAuthorityStore.getData().items.length; i++) {
                const groupAuthorityItem = groupAuthorityStore.getData().items[i];
                grantMap[groupAuthorityItem.get('groupId')] = groupAuthorityItem;
            }
            for (const byIdMapKey in groupTreeStore.byIdMap) {
                groupTreeStore.byIdMap[byIdMapKey].set('granted', grantMap[byIdMapKey]);
            }
        }
    },
    hBtnEnable: function (btn) {
        const me = this,
            authority = this.getViewModel().get('authority'),
            record = btn.lookupViewModel().get('record');
        if (record.get('granted')) {
            PortalApp.data.api.entity.EntityCRUDApi.delete({
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.GroupAuthorityEntity',
                ids: [record.get('granted').id],
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            });
        } else {
            PortalApp.data.api.entity.EntityCRUDApi.create({
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.GroupAuthorityEntity',
                values: {
                    authorityId: authority.get('id'),
                    groupId: record.get('id')
                },
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            });
        }
    }
});
