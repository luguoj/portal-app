Ext.define('PortalApp.view.organizationconsole.organization.UserViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.organizationconsole-organization-userviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        if (this.getView().rendered) {
            const organization = this.getViewModel().get('organization');
            if (organization) {
                const userStore = this.getStore('users'),
                    statusStore = this.getStore('statuses'),
                    userStatusStore = this.getStore('userStatuses');
                userStatusStore.addFilter(
                    {
                        property: 'organizationId',
                        operator: '==',
                        value: organization.get('id')
                    }, true);
                userStatusStore.load();
                userStore.load();
                statusStore.addFilter(
                    {
                        property: 'organizationId',
                        operator: '==',
                        value: organization.get('useId')
                    }, true);
                statusStore.load();
            }
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    onDataLoad: function (store) {
        const userStore = this.getStore('users'),
            userStatusStore = this.getStore('userStatuses'),
            statusStore = this.getStore('statuses');
        if ((userStore == store || userStatusStore == store)
            && userStore.isLoaded() && userStatusStore.isLoaded()) {
            const grantMap = {};
            for (let i = 0; i < userStatusStore.getData().items.length; i++) {
                const authorityUser = userStatusStore.getData().items[i];
                grantMap[authorityUser.get('userId')] = grantMap[authorityUser.get('userId')] || [];
                grantMap[authorityUser.get('userId')].push(authorityUser);
            }
            for (let i = 0; i < userStore.getData().items.length; i++) {
                const user = userStore.getData().items[i];
                user.set('statuses', grantMap[user.get('id')]);
            }
        }
        if (statusStore.isLoaded()) {
            const user = this.getViewModel().get('user');
            if (user) {
                const grantedStatuses = user.get('statuses'),
                    grantMap = {};
                if (grantedStatuses) {
                    for (let i = 0; i < grantedStatuses.length; i++) {
                        const grantedStatus = grantedStatuses[i];
                        grantMap[grantedStatus.get('statusId')] = grantedStatus;
                    }
                }
                for (let i = 0; i < statusStore.getData().items.length; i++) {
                    const status = statusStore.getData().items[i];
                    status.set('granted', grantMap[status.get('id')]);
                }
            } else {
                for (let i = 0; i < statusStore.getData().items.length; i++) {
                    const status = statusStore.getData().items[i];
                    status.set('granted', null);
                }
            }
        }
    },
    onGrdUserSelectionChange: function (sm, selections) {
        const viewModel = this.getViewModel(),
            grdStatus = this.lookup('grdStatus');
        if (selections.length) {
            const user = selections[0];
            viewModel.set('user', user);
            grdStatus.enable();
            this.onDataLoad(this.getStore('statuses'));
        } else {
            viewModel.set('user');
            grdStatus.disable();
            this.onDataLoad(this.getStore('statuses'));
        }
    },
    hBtnEnable: function (btn) {
        const me = this,
            organization = this.getViewModel().get('organization'),
            user = this.getViewModel().get('user'),
            record = btn.lookupViewModel().get('record');
        if (record.get('granted')) {
            PortalApp.data.api.entity.EntityCRUDApi.delete({
                application: 'organization',
                domainType: 'org.psr.platform.organization.entity.UserStatusEntity',
                ids: [record.get('granted').id],
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            });
        } else {
            PortalApp.data.api.entity.EntityCRUDApi.create({
                application: 'organization',
                domainType: 'org.psr.platform.organization.entity.UserStatusEntity',
                values: {
                    organizationId: organization.get('id'),
                    statusId: record.get('id'),
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
