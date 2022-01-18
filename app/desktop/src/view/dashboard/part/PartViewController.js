Ext.define('PortalApp.view.dashboard.PartViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboard-partviewcontroller',
    afterRender: function (view) {
        const ctControl = this.lookup('ctControl');
        this.dragSource = new Ext.drag.Source({
            element: ctControl.el,
            handle: '.board-dd-handle',
            describe: function (info) {
                info.setData('originPart', view);
            },
            proxy: {
                type: 'placeholder',
                cls: 'psr-proxy-drag',
                html: view.getPartId()
            }
        });
        this.dropTarget = new Ext.drag.Target({
            element: ctControl.el,
            listeners: {
                scope: this,
                drop: this.onDrop
            }
        });
        this.lookup('ctBody').add({
            reference: 'ctParts',
            xtype: 'container',
            anchor: '100% 100%',
            layout: {type: view.getPartLayout(), align: 'stretch'},
            bind: {
                hidden: '{!split}'
            }
        });
        this.loadData();
    },
    loadData: function () {
        const view = this.getView();
        if (view.rendered) {
            const contentTemplate = view.getContent(),
                partTemplates = view.getParts(),
                ctContent = this.lookup('ctContent'),
                ctParts = this.lookup('ctParts');
            delete this.splitters;
            delete this.parts;
            ctContent.removeAll();
            ctParts.removeAll();
            if (contentTemplate) {
                const dashboardPartId = contentTemplate.dashboardPartId;
                if (dashboardPartId) {
                    PortalApp.data.api.entity.EntityCRUDApi.findAllById({
                        application: 'portal',
                        domainType: 'org.psr.platform.portal.entity.DashboardPartEntity',
                        ids: [dashboardPartId],
                        success: function (data) {
                            if (data && data.length > 0) {
                                const moduleId = data[0].moduleId,
                                    partConfig = data[0].config;
                                const finalConfig = Object.assign(
                                    {},
                                    eval('(' + partConfig + ')'),
                                    contentTemplate
                                )
                                delete finalConfig.dashboardPartId;
                                ctContent.add({
                                    xtype: 'portalapp-modulecomponent',
                                    moduleId: moduleId,
                                    componentTpl: finalConfig
                                });
                            }
                        }
                    });
                } else {
                    ctContent.add(Ext.create(contentTemplate));
                }
            } else if (partTemplates && partTemplates.length > 0) {
                for (let i = 0; i < partTemplates.length; i++) {
                    const partTemplate = partTemplates[i];
                    this.appendPart(partTemplate)
                }
            }
        }
    },
    appendPart: function (partTemplate) {
        const me = this,
            view = this.getView(),
            editing = view.getEditing(),
            splitting = view.getSplitting(),
            partLayout = view.getPartLayout(),
            ctParts = this.lookup('ctParts'),
            splitters = this.splitters = this.splitters || [],
            parts = this.parts = this.parts || [],
            partCfg = Object.assign({
                xtype: 'dashboard-partview',
                flex: partLayout == 'vbox' ? 90 : 120,
                partLayout: partLayout == 'vbox' ? 'hbox' : 'vbox',
                editing: editing,
                splitting: splitting,
                listeners: {
                    removeme: function (part) {
                        me.removePart(part);
                    }
                }
            }, partTemplate);
        parts.push(ctParts.add(Ext.create(partCfg)));
        if (ctParts.items.length > 1) {
            splitters.push(
                ctParts.insert(ctParts.items.length - 1, {
                    xtype: 'splitter',
                    maskOnDisable: false,
                    collapseOnDblClick: false,
                    height: 3,
                    width: 3,
                    disabled: !editing
                })
            );
        }
        this.updatePartId(view.getPartId());
        this.getViewModel().set('split', true);
    },
    removePart: function (part) {
        const view = this.getView(),
            ctParts = this.lookup('ctParts'),
            partIndex = ctParts.items.indexOf(part);
        if (this.splitters.length > 0) {
            if (partIndex == 0) {
                this.splitters.remove(
                    ctParts.remove(ctParts.items.items[1])
                );
            } else {
                this.splitters.remove(
                    ctParts.remove(ctParts.items.items[partIndex - 1])
                );
            }
        }
        this.parts.remove(
            ctParts.remove(part)
        );
        if (this.parts.length == 1) {
            const lastPart = this.parts[0],
                template = lastPart.genTemplate();
            this.parts.remove(
                view.remove(lastPart)
            );
            this.getViewModel().set('split', false);
            view.setParts(template.parts);
            view.setContent(template.content);
        }
        this.updatePartId(view.getPartId());
    },
    updatePartId(value) {
        const parts = this.parts;
        if (parts) {
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                part.setPartId(value + (value ? '-' : '') + (i + 1));
            }
        }
        if (this.editor) {
            this.editor.setPartId(value);
        }
        if (this.dragSource) {
            this.dragSource.getProxy().setHtml(value);
        }
    },
    onDrop: function (target, info, event) {
        const view = this.getView();
        info.getData('originPart').then(function (originPart) {
            if (view == originPart) {
                return;
            }
            view.setContent(originPart.getContent());
            originPart.setContent();
        });
    },
    hBtnAdd: function () {
        const viewModel = this.getViewModel();
        if (!viewModel.get('split')) {
            this.appendPart({content: this.getView().getContent()});
            this.lookup('ctContent').removeAll();
        }
        this.appendPart();
    },
    hBtnRemove: function () {
        const view = this.getView();
        view.fireEvent('removeme', view);
    },
    hBtnConfig: function (btn) {
        const view = this.getView(),
            dashboardview = view.up('dashboardview'),
            editor = this.editor = Ext.create({
                width: dashboardview.getWidth() * 0.75,
                height: dashboardview.getHeight() * 0.75,
                xtype: 'dashboard-part-editorview',
                partId: view.getPartId(),
                content: view.getContent(),
                animateTarget: view,
                listeners: {
                    save: function (content) {
                        try {
                            view.setContent(content);
                            editor.close();
                        } catch (e) {
                            PSR.util.Message.error(e.message);
                        }
                    },
                    close: function () {
                        view.unmask();
                    }
                }
            });
        view.fireEvent('popupview', editor);
        view.mask();
    },
    genTemplate: function () {
        const view = this.getView(),
            flex = view.flex,
            parts = this.parts,
            template = {parts: [], content: view.getContent()};
        if (parts && parts.length > 0) {
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                template.parts.push(part.genTemplate());
            }
        }
        if (flex) {
            template.flex = flex;
        }
        return template;
    },
    beforeDestroy: function () {
        if (this.editor) {
            this.editor.close();
            delete this.editor;
        }
    },
});
