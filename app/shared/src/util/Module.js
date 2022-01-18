Ext.define('PortalApp.util.Module', {
    singleton: true,
    module: {},
    load: function (opt) {
        const moduleId = opt.moduleId,
            module = PortalApp.util.Module.module[moduleId] = PortalApp.util.Module.module[moduleId]
                || {
                    loading: null,
                    scriptFile: null,
                    styleFile: null
                };
        if (module.loading == 'complete') {
            if (opt.success) {
                opt.success(module);
            }
            return true;
        } else if (module.loading == 'failure') {
            console.error(new Error('模块加载失败'));
            if (opt.failure) {
                opt.failure();
            }
        } else if (module.loading == true) {
            if (module.scriptFile != null && module.styleFile != null) {
                module.loading = 'complete';
            } else {
                setTimeout(function () {
                    PortalApp.util.Module.load(opt);
                }, 250);
            }
        } else {
            if (module.loading == null) {
                module.loading = true;
                PSR.data.Ajax.request({
                    method: 'GET',
                    url: window.portalEnv.gateway + '/portal/api/user_profile/module/' + moduleId,
                    withAuthToken: true,
                    disableCaching: true,
                    bizSuccess: function (data) {
                        if (data && data.module && data.module.enabled) {
                            Object.assign(module, data.module);
                            module.actions = data.moduleActions;
                            module.resources = data.moduleResources;
                            if (module.scriptFileId) {
                                PSR.util.Import.script({
                                    url: PortalApp.data.api.file.FileApi.getAPIUrl() + '/' + module.scriptFileId,
                                    withAuthToken: true,
                                    success: function () {
                                        module.scriptFile = true;
                                    },
                                    failure: function () {
                                        module.scriptFile = false;
                                    }
                                });
                            } else {
                                module.scriptFile = false;
                            }
                            if (module.styleFileId) {
                                PSR.util.Import.style({
                                    url: PortalApp.data.api.file.FileApi.getAPIUrl() + '/' + module.styleFileId,
                                    withAuthToken: true,
                                    success: function () {
                                        module.styleFile = true;
                                    },
                                    failure: function () {
                                        module.styleFile = false;
                                    }
                                });
                            } else {
                                module.styleFile = false;
                            }
                        } else {
                            console.log(data);
                            module.loading = 'failure';
                        }
                    },
                    failure: function () {
                        module.loading = 'failure';
                        if (opt.failure) {
                            opt.failure();
                        }
                    },
                    complete: function () {
                        PortalApp.util.Module.load(opt);
                    }
                });
            }
            return false;
        }
    }
});