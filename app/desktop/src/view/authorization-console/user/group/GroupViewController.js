Ext.define('PortalApp.view.authorizationConsole.user.GroupViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authorizationconsole-user-groupviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        if (this.getView().rendered) {
            const groupTreeStore = this.getStore('groupTree'),
                userGroupStore = this.getStore('userGroups'),
                user = this.getViewModel().get('user');
            if (user) {
                groupTreeStore.load();
                userGroupStore.addFilter({
                    property: 'userId',
                    operator: '==',
                    value: user.get('id')
                }, true);
                userGroupStore.load();
            }
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    onDataLoad: function () {
        const groupTreeStore = this.getStore('groupTree'),
            userGroupStore = this.getStore('userGroups');
        if (groupTreeStore.isLoaded() && userGroupStore.isLoaded()) {
            const grantMap = {};
            for (let i = 0; i < userGroupStore.getData().items.length; i++) {
                const userGroupItem = userGroupStore.getData().items[i];
                grantMap[userGroupItem.get('groupId')] = userGroupItem;
            }
            for (const byIdMapKey in groupTreeStore.byIdMap) {
                groupTreeStore.byIdMap[byIdMapKey].set('granted', grantMap[byIdMapKey]);
            }
        }
    },
    hBtnEnable: function (btn) {
        const me = this,
            user = this.getViewModel().get('user'),
            record = btn.lookupViewModel().get('record');
        if (record.get('granted')) {
            PortalApp.data.api.entity.EntityCRUDApi.delete({
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.UserGroupEntity',
                ids: [record.get('granted').id],
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            });
        } else {
            PortalApp.data.api.entity.EntityCRUDApi.create({
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.UserGroupEntity',
                values: {
                    userId: user.get('id'),
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
