Ext.define('PortalApp.view.portalConsole.UserGroupViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-usergroupviewcontroller',
    hBtnRefresh: function () {
        this.loadData();
    },
    loadData: function () {
        const userStore = this.getStore('users'),
            groupTreeStore = this.getStore('groupTree'),
            userGroupStore = this.getStore('userGroups');
        userStore.load();
        groupTreeStore.load();
        userGroupStore.load();
    },
    onDataLoad: function () {
        const groupTreeStore = this.getStore('groupTree'),
            userGroupStore = this.getStore('userGroups');
        if (groupTreeStore.isLoaded() && userGroupStore.isLoaded()) {
            const grantMap = {};
            for (let i = 0; i < userGroupStore.getData().items.length; i++) {
                const groupUser = userGroupStore.getData().items[i];
                grantMap[groupUser.get('groupId')] = groupUser;
            }
            for (const byIdMapKey in groupTreeStore.byIdMap) {
                groupTreeStore.byIdMap[byIdMapKey].set('granted', grantMap[byIdMapKey]);
            }
        }
    },
    onGrdUserSelectionChange: function (sm, selections) {
        const view = this.getView(),
            viewModel = this.getViewModel(),
            treepanel = view.down('treepanel'),
            userGroupStore = this.getStore('userGroups');
        if (selections.length) {
            viewModel.set('user', selections[0]);
            userGroupStore.addFilter(
                {
                    property: 'userId',
                    operator: '==',
                    value: selections[0].get('id')
                }
            );
            userGroupStore.load();
            treepanel.enable();
        } else {
            viewModel.set('user');
            userGroupStore.addFilter(
                {
                    property: 'userId',
                    operator: 'isnull',
                }
            );
            treepanel.disable();
        }
    },
    hBtnEnable: function (btn) {
        const me = this,
            user = this.getViewModel().get('user'),
            record = btn.lookupViewModel().get('record');
        if (record.get('granted')) {
            PortalApp.data.api.entity.EntityCRUDApi.delete({
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.UserGroupEntity',
                ids: [record.get('granted').id],
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            });
        } else {
            PortalApp.data.api.entity.EntityCRUDApi.create({
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.UserGroupEntity',
                values: {
                    groupId: record.get('id'),
                    userId: user.get('id')
                },
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            });
        }
    }
});
