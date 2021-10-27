Ext.define('PSR.util.Module', {
    singleton: true,
    loads: 2,
    module: {},
    // 加载程序
    loadSource: function (opt) {
        const moduleId = opt.moduleId,
            module = PSR.util.Module.module[moduleId];
        if (!module.source) {
            // 如果尚未加载，则执行加载
            module.loading++;
            module.source = 'loading';
            const moduleSrcUrl = window.moduleSite + '/' + opt.moduleId + '/index.js?v=' + (new Date()).getTime();
            const scriptEl = document.createElement('script');
            // 加载成功
            scriptEl.onload = scriptEl.onreadystateschange = function () {
                if (!this.readyState
                    || this.readyState == 'loaded' || this.readyState == 'complete') {
                    module.source = true;
                    module.loaded++;
                    module.loading--;
                }
                PSR.util.Module.loadSource(opt);
            };
            // 加载失败
            scriptEl.onerror = function () {
                module.source = false;
                module.loading--;
                PSR.util.Message.info('模块程序加载失败');
            }
            scriptEl.src = moduleSrcUrl;
            document.body.appendChild(scriptEl);
        } else if (module.source == 'loading') {
            // 如果正在加载，等待500ms后重试
            setTimeout(function () {
                PSR.util.Module.loadSource(opt);
            }, 500);
        } else {
            // 如果已经完成加载
            if (opt.callback) {
                opt.callback();
            }
            return true;
        }
        return false;
    },
    loadAction: function (opt) {
        const moduleId = opt.moduleId,
            module = PSR.util.Module.module[moduleId];
        if (!module.actions) {
            // 如果尚未加载，则执行加载
            module.loading++;
            module.actions = 'loading';
            PSR.Ajax.request({
                method: 'GET',
                url: window.gatewaySite + '/extapp/api/desktop/module_action/',
                params: {
                    moduleId: moduleId
                },
                withCredentials: true,
                withAuthToken: true,
                disableCaching: true,
                // 加载成功
                bizSuccess: function (data) {
                    const actions = {};
                    if (data && data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            actions[data[i].code] = true;
                        }
                    }
                    module.actions = actions;
                    module.loaded++;
                    module.loading--;
                },
                complete: function () {
                    if (module.actions == 'loading') {
                        // 加载失败
                        module.actions = false;
                        module.loading--;
                        PSR.util.Message.info('模块操作加载失败');
                    } else {
                        PSR.util.Module.loadAction(opt);
                    }
                }
            });
        } else if (module.actions == 'loading') {
            // 如果正在加载，等待500ms后重试
            setTimeout(function () {
                PSR.util.Module.loadAction(opt);
            }, 500);
        } else {
            // 如果已经完成加载
            if (opt.callback) {
                opt.callback(module.actions);
            }
            return module.actions;
        }
        return false;
    },
    load: function (opt) {
        const moduleId = opt.moduleId,
            module = PSR.util.Module.module[moduleId] || {
                loading: 0,
                loaded: 0,
                source: false,
                actions: false
            };
        PSR.util.Module.module[moduleId] = module;
        if (module.loading == 0) {
            if (module.loaded == 0) {
                // 闲置状态或失败且存在未加载负载，执行加载
                PSR.util.Module.loadSource({
                    moduleId: moduleId,
                    callback: function () {
                        PSR.util.Module.load(opt);
                    }
                });
                PSR.util.Module.loadAction({
                    moduleId: moduleId,
                    callback: function () {
                        PSR.util.Module.load(opt);
                    }
                });
            } else if (module.loaded == PSR.util.Module.loads) {
                if (opt.callback) {
                    opt.callback(module);
                    return true;
                }
            } else {
                PSR.util.Message.error('模块加载失败');
            }
        } else {
            setTimeout(function () {
                PSR.util.Module.load(opt);
            }, 250);
        }
        return false;
    },
    addItem: function (opt) {
        const moduleId = opt.moduleId,
            config = opt.config,
            parent = opt.parent,
            callback = opt.callback;
        PSR.util.Module.load({
            moduleId: moduleId,
            callback: function () {
                const actions = PSR.util.Module.actions[moduleId];
                let item;
                try {
                    item = Ext.create(Object.assign({}, config, {actions: actions}))
                    item = parent.add(item);
                } catch (e) {
                    debugger
                    PSR.util.Message.error('创建模块失败')
                }
                if (item && callback) {
                    callback(item);
                }
            }
        });
    }
});