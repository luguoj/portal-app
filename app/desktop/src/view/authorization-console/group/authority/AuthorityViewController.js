Ext.define('PortalApp.view.authorizationConsole.group.AuthorityViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authorizationconsole-group-authorityviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        if (this.getView().rendered) {
            const authorityStore = this.getStore('authorities'),
                groupAuthorityStore = this.getStore('groupAuthorities'),
                group = this.getViewModel().get('group');
            if (group) {
                authorityStore.load();
                groupAuthorityStore.addFilter({
                    property: 'groupId',
                    operator: '==',
                    value: group.get('id')
                }, true);
                groupAuthorityStore.load();
            }
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    onDataLoad: function () {
        const authorityStore = this.getStore('authorities'),
            groupAuthorityStore = this.getStore('groupAuthorities');
        if (authorityStore.isLoaded() && groupAuthorityStore.isLoaded()) {
            const grantMap = {};
            for (let i = 0; i < groupAuthorityStore.getData().items.length; i++) {
                const groupAuthorityItem = groupAuthorityStore.getData().items[i];
                grantMap[groupAuthorityItem.get('authorityId')] = groupAuthorityItem;
            }
            for (let i = 0; i < authorityStore.getData().items.length; i++) {
                const authorityItem = authorityStore.getData().items[i];
                authorityItem.set('granted', grantMap[authorityItem.get('id')]);
            }
        }
    },
    hBtnEnable: function (btn) {
        const me = this,
            group = this.getViewModel().get('group'),
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
                    groupId: group.get('id'),
                    authorityId: record.get('id')
                },
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            });
        }
    }
});