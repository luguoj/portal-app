Ext.define('PortalApp.view.authorizationConsole.group.UserViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authorizationconsole-group-userviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    loadData: function () {
        if (this.getView().rendered) {
            const group = this.getViewModel().get('group'),
                userStore = this.getStore('users'),
                groupUserStore = this.getStore('groupUsers');
            if (group) {
                userStore.load();
                groupUserStore.addFilter(
                    {
                        property: 'groupId',
                        operator: '==',
                        value: group.get('id')
                    }
                );
                groupUserStore.load();
            }
        }
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
            record = btn.lookupViewModel().get('record');
        PortalApp.data.api.entity.EntityCRUDApi.delete({
            application: 'authorization',
            domainType: 'org.psr.platform.authorization.entity.UserGroupEntity',
            ids: [record.get('id')],
            success: function (data) {
                PSR.util.Message.info('保存成功');
                me.loadData();
            }
        });
    }
});