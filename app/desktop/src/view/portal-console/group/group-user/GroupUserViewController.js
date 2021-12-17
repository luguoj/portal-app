Ext.define('PortalApp.view.portalConsole.group.GroupUserViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-group-groupuserviewcontroller',
    afterRender: function (view) {
        if (view.getGroup()) {
            this.loadData();
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    loadData: function () {
        const userStore = this.getStore('users'),
            groupUserStore = this.getStore('groupUsers');
        userStore.load();
        groupUserStore.addFilter(
            {
                property: 'groupId',
                operator: '==',
                value: this.getViewModel().get('group').get('id')
            }
        );
        groupUserStore.load();
    },
    onDataLoad: function () {
        const userStore = this.getStore('users'),
            groupUserStore = this.getStore('groupUsers');
        if (userStore.isLoaded() && groupUserStore.isLoaded()) {
            const grantMap = {};
            for (let i = 0; i < groupUserStore.getData().items.length; i++) {
                const groupUser = groupUserStore.getData().items[i];
                grantMap[groupUser.get('userId')] = groupUser;
            }
            for (let i = 0; i < userStore.getData().items.length; i++) {
                const user = userStore.getData().items[i];
                user.set('granted', grantMap[user.get('id')]);
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
                    groupId: group.get('id'),
                    userId: record.get('id')
                },
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            });
        }
    },
    hBtnDisable: function (btn) {
        const me = this,
            group = this.getViewModel().get('group'),
            record = btn.lookupViewModel().get('record');
        PortalApp.data.api.entity.EntityCRUDApi.delete({
            application: 'portal',
            domainType: 'org.psr.platform.portal.entity.UserGroupEntity',
            ids: [record.get('id')],
            success: function (data) {
                PSR.util.Message.info('保存成功');
                me.loadData();
            }
        });
    }
});