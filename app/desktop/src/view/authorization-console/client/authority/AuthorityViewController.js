Ext.define('PortalApp.view.authorizationConsole.client.AuthorityViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authorizationconsole-client-authorityviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        if (this.getView().rendered) {
            const authorityStore = this.getStore('authorities'),
                clientAuthorityStore = this.getStore('clientAuthorities'),
                client = this.getViewModel().get('client');
            if (client) {
                authorityStore.load();
                clientAuthorityStore.addFilter({
                    property: 'clientId',
                    operator: '==',
                    value: client.get('id')
                }, true);
                clientAuthorityStore.load();
            }
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    onDataLoad: function () {
        const authorityStore = this.getStore('authorities'),
            clientAuthorityStore = this.getStore('clientAuthorities');
        if (authorityStore.isLoaded() && clientAuthorityStore.isLoaded()) {
            const grantMap = {};
            for (let i = 0; i < clientAuthorityStore.getData().items.length; i++) {
                const clientAuthorityItem = clientAuthorityStore.getData().items[i];
                grantMap[clientAuthorityItem.get('authorityId')] = clientAuthorityItem;
            }
            for (let i = 0; i < authorityStore.getData().items.length; i++) {
                const authorityItem = authorityStore.getData().items[i];
                authorityItem.set('granted', grantMap[authorityItem.get('id')]);
            }
        }
    },
    hBtnEnable: function (btn) {
        const me = this,
            client = this.getViewModel().get('client'),
            record = btn.lookupViewModel().get('record');
        if (record.get('granted')) {
            PortalApp.data.api.entity.EntityCRUDApi.delete({
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.ClientAuthorityEntity',
                ids: [record.get('granted').id],
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            });
        } else {
            PortalApp.data.api.entity.EntityCRUDApi.create({
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.ClientAuthorityEntity',
                values: {
                    clientId: client.get('id'),
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
