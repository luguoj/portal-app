Ext.define('PortalApp.view.authorizationConsole.authority.UserViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authorizationconsole-authority-userviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    loadData: function () {
        if (this.getView().rendered) {
            const authority = this.getViewModel().get('authority'),
                userStore = this.getStore('users'),
                authorityUserStore = this.getStore('authorityUsers');
            if (authority) {
                userStore.load();
                authorityUserStore.addFilter(
                    {
                        property: 'authorityId',
                        operator: '==',
                        value: authority.get('id')
                    }
                );
                authorityUserStore.load();
            }
        }
    },
    onDataLoad: function () {
        const userStore = this.getStore('users'),
            authorityUserStore = this.getStore('authorityUsers');
        if (userStore.isLoaded() && authorityUserStore.isLoaded()) {
            const grantMap = {};
            for (let i = 0; i < authorityUserStore.getData().items.length; i++) {
                const authorityUser = authorityUserStore.getData().items[i];
                grantMap[authorityUser.get('userId')] = authorityUser;
            }
            for (let i = 0; i < userStore.getData().items.length; i++) {
                const user = userStore.getData().items[i];
                user.set('granted', grantMap[user.get('id')]);
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
                domainType: 'org.psr.platform.authorization.entity.UserAuthorityEntity',
                ids: [record.get('granted').id],
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            });
        } else {
            PortalApp.data.api.entity.EntityCRUDApi.create({
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.UserAuthorityEntity',
                values: {
                    authorityId: authority.get('id'),
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
            domainType: 'org.psr.platform.authorization.entity.UserAuthorityEntity',
            ids: [record.get('id')],
            success: function (data) {
                PSR.util.Message.info('保存成功');
                me.loadData();
            }
        });
    }
});