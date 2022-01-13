Ext.define('PortalApp.util.Module', {
    singleton: true,
    module: {},
    load: function (opt) {
        const moduleId = opt.moduleId,
            module = PortalApp.util.Module.module[moduleId] = PortalApp.util.Module.module[moduleId]
                || {
                    loading: false,
                    ready: {
                        scriptFile: false,
                        styleFile: false
                    }
                };
        let moduleReady = module.ready.scriptFile == true && module.ready.styleFile == true;
        if (moduleReady) {
            module.loading == false;
            if (opt.success) {
                opt.success(module);
            }
            return true;
        } else {
            if (!module.loading) {
                module.loading = true;
                PSR.data.Ajax.request({
                    method: 'GET',
                    url: window.portalEnv.gateway + '/portal/api/user_profile/module/' + moduleId,
                    withAuthToken: true,
                    disableCaching: true,
                    bizSuccess: function (data) {
                        if (data && data.module) {
                            Object.assign(module, data.module);
                            module.actions = data.moduleActions;
                            module.resources = data.moduleResources;
                            if (module.scriptFileId) {
                                PSR.util.Import.script({
                                    url: PortalApp.data.api.file.FileApi.getAPIUrl() + '1/' + module.scriptFileId,
                                    withAuthToken: true,
                                    success: function () {
                                        module.ready.scriptFile = true;
                                    },
                                    failure: function () {
                                        module.ready.scriptFile = 'failure';
                                    }
                                });
                            } else {
                                module.ready.scriptFile = true;
                            }
                            if (module.styleFileId) {
                                PSR.util.Import.style({
                                    url: PortalApp.data.api.file.FileApi.getAPIUrl() + '/' + module.styleFileId,
                                    withAuthToken: true,
                                    success: function () {
                                        module.ready.styleFile = true;
                                    },
                                    failure: function () {
                                        module.ready.styleFile = 'failure';
                                    }
                                });
                            } else {
                                module.ready.styleFile = true;
                            }
                        } else {
                            console.log(data);
                            module.ready.scriptFile = 'failure';
                            module.ready.styleFile = 'failure';
                        }
                    },
                    failure: function () {
                        module.ready.scriptFile = 'failure';
                        module.ready.styleFile = 'failure';
                    }
                });
            }
            if (module.ready.scriptFile == 'failure' || module.ready.styleFile == 'failure') {
                PSR.util.Message.error('模块加载失败');
                if (opt.failure) {
                    opt.failure();
                }
            } else {
                setTimeout(function () {
                    PortalApp.util.Module.load(opt);
                }, 250);
            }
            return false;
        }
    }
});