Ext.define('PortalApp.view.portalConsole.group.GroupModuleActionViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-group-groupmoduleactionviewcontroller',
    onAfterRendered: function (view) {
        if (view.getGroup()) {
            this.loadData();
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    loadData: function () {
        const moduleStore = this.getStore('modules'),
            actionStore = this.getStore('actions'),
            groupModuleActionStore = this.getStore('groupModuleActions');
        moduleStore.load();
        actionStore.load();
        groupModuleActionStore.addFilter(
            {
                property: 'groupId',
                operator: '==',
                value: this.getViewModel().get('group').get('id')
            }
        );
        groupModuleActionStore.load();
    },
    onDataLoad: function () {
        const moduleStore = this.getStore('modules'),
            actionStore = this.getStore('actions'),
            groupModuleActionStore = this.getStore('groupModuleActions'),
            moduleActionTreeStore = this.getStore('moduleActionTree');
        if (moduleStore.isLoaded() && actionStore.isLoaded() && groupModuleActionStore.isLoaded()) {
            const modules = moduleStore.getData().items,
                actions = actionStore.getData().items,
                actionMap = {},
                groupModuleActions = groupModuleActionStore.getData().items,
                grantMap = {},
                moduleActionTreeData = [];
            for (let i = 0; i < actions.length; i++) {
                const action = actions[i];
                if (!actionMap[action.get('moduleId')]) {
                    actionMap[action.get('moduleId')] = [];
                }
                actionMap[action.get('moduleId')].push(action);
            }
            for (let i = 0; i < groupModuleActions.length; i++) {
                const groupModuleAction = groupModuleActions[i];
                grantMap[groupModuleAction.get('moduleActionId')] = groupModuleActions;
            }
            for (let i = 0; i < modules.length; i++) {
                const module = modules[i];
                if (!actionMap[module.get('id')]) {
                    continue;
                }
                const moduleNode = {
                    id: module.get('id'),
                    module: module,
                    children: [],
                    iconCls: 'x-fa fa-list-alt',
                    leaf: false,
                    expanded: true
                };
                moduleActionTreeData.push(moduleNode);
                for (let j = 0; j < actionMap[module.get('id')].length; j++) {
                    const action = actionMap[module.get('id')][j];
                    moduleNode.children.push({
                        id: action.get('id'),
                        action: action,
                        granted: grantMap[action.get('id')],
                        iconCls: 'x-fa fa-bolt',
                        leaf: true
                    });
                }
            }
            moduleActionTreeStore.getProxy().setData({children: moduleActionTreeData});
            moduleActionTreeStore.load();
        }
    },
    hBtnEnabled: function (btn) {
        const me = this,
            group = this.getViewModel().get('group'),
            record = btn.lookupViewModel().get('record');
        if (record.get('granted')) {
            PortalApp.data.api.entity.EntityCRUDApi.delete({
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.GroupModuleActionEntity',
                ids: [record.get('granted').id],
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            });
        } else {
            PortalApp.data.api.entity.EntityCRUDApi.create({
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.GroupModuleActionEntity',
                values: {
                    groupId: group.get('id'),
                    moduleActionId: record.get('id')
                },
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            });
        }
    }
});