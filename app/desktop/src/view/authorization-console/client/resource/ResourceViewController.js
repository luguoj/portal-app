Ext.define('PortalApp.view.authorizationConsole.client.ResourceViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authorizationconsole-client-resourceviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        if (this.getView().rendered) {
            const resourceStore = this.getStore('resources'),
                clientResourceStore = this.getStore('clientResources'),
                client = this.getViewModel().get('client');
            if (client) {
                resourceStore.load();
                clientResourceStore.addFilter({
                    property: 'clientId',
                    operator: '==',
                    value: client.get('id')
                }, true);
                clientResourceStore.load();
            }
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    onDataLoad: function () {
        const resourceStore = this.getStore('resources'),
            clientResourceStore = this.getStore('clientResources');
        if (resourceStore.isLoaded() && clientResourceStore.isLoaded()) {
            const grantMap = {};
            for (let i = 0; i < clientResourceStore.getData().items.length; i++) {
                const clientResourceItem = clientResourceStore.getData().items[i];
                grantMap[clientResourceItem.get('resourceId')] = clientResourceItem;
            }
            for (let i = 0; i < resourceStore.getData().items.length; i++) {
                const resourceItem = resourceStore.getData().items[i];
                resourceItem.set('granted', grantMap[resourceItem.get('id')]);
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
                domainType: 'org.psr.platform.authorization.entity.ClientResourceEntity',
                ids: [record.get('granted').id],
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            });
        } else {
            PortalApp.data.api.entity.EntityCRUDApi.create({
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.ClientResourceEntity',
                values: {
                    clientId: client.get('id'),
                    resourceId: record.get('id')
                },
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            });
        }
    }
});
