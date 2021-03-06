Ext.define('PortalApp.view.authorizationConsole.user.AuthorityViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authorizationconsole-user-authorityviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        if (this.getView().rendered) {
            const authorityStore = this.getStore('authorities'),
                userAuthorityStore = this.getStore('userAuthorities'),
                user = this.getViewModel().get('user');
            if (user) {
                authorityStore.load();
                userAuthorityStore.addFilter({
                    property: 'userId',
                    operator: '==',
                    value: user.get('id')
                }, true);
                userAuthorityStore.load();
            }
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    onDataLoad: function () {
        const authorityStore = this.getStore('authorities'),
            userAuthorityStore = this.getStore('userAuthorities');
        if (authorityStore.isLoaded() && userAuthorityStore.isLoaded()) {
            const grantMap = {};
            for (let i = 0; i < userAuthorityStore.getData().items.length; i++) {
                const userAuthorityItem = userAuthorityStore.getData().items[i];
                grantMap[userAuthorityItem.get('authorityId')] = userAuthorityItem;
            }
            for (let i = 0; i < authorityStore.getData().items.length; i++) {
                const authorityItem = authorityStore.getData().items[i];
                authorityItem.set('granted', grantMap[authorityItem.get('id')]);
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
                domainType: 'org.psr.platform.authorization.entity.UserAuthorityEntity',
                ids: [record.get('granted').id],
                success: function (data) {
                    PSR.util.Message.info('????????????');
                    me.loadData();
                }
            });
        } else {
            PortalApp.data.api.entity.EntityCRUDApi.create({
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.UserAuthorityEntity',
                values: {
                    userId: user.get('id'),
                    authorityId: record.get('id')
                },
                success: function (data) {
                    PSR.util.Message.info('????????????');
                    me.loadData();
                }
            });
        }
    }
});