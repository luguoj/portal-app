Ext.define('PSR.Flowchart', {
    xtype: 'psr-flowchart',
    extend: 'Ext.Component',
    element: {
        reference: 'element',
        class: 'x-nativescroller',
        style: 'overflow:auto',
        children: [{
            reference: 'boardEl',
            style: 'padding:20px',
            children: [{
                reference: 'paperEl'
            }]
        }]
    },
    config: {
        enableGrid: false,
        flowOptions: {},
        layoutDir: 'TB',
        layoutNodeSep: 60,
        layoutEdgeSep: 60
    },
    constructor: function (config) {
        const me = this;
        me.graph = new joint.dia.Graph;
        me.flow = {nodes: {}, links: []};
        me.callParent([config]);
    },
    afterRender: function () {
        const me = this,
            $WRAP = $(me.element.dom),
            $PAPER = $(me.paperEl.dom),
            enableGrid = this.getEnableGrid(),
            paperOptions = {
                el: this.paperEl.dom,
                model: this.graph,
                width: 10000,
                height: 10000,
                gridSize: 10,
                background: {
                    color: '#fff'
                },
                snapLinks: true,
                restrictTranslate: true,
                interactive: {
                    elementMove: false
                }
            };
        if (enableGrid) {
            paperOptions.drawGrid = {
                name: 'doubleMesh',
                args: [{
                    color: '#dedede',
                    scaleFactor: 1,
                    thickness: 1
                }, {
                    color: '#dedede',
                    scaleFactor: 10,
                    thickness: 2
                }]
            };
        }
        this.paper = new joint.dia.Paper(paperOptions);
        $PAPER.css('cursor', 'grab');
        // 通过jointjs点击事件绑定/解绑warpEl的鼠标移动事件
        this.paper.on('blank:pointerdown', function (evt, x, y) {
            const originX = evt.offsetX,
                originY = evt.offsetY;
            $PAPER.css('cursor', 'grabbing');
            $WRAP.on('mousemove', function (evt) {
                let scrollLeft = $WRAP.scrollLeft() - (evt.offsetX - originX);
                let scrollTop = $WRAP.scrollTop() - (evt.offsetY - originY);
                scrollLeft = 0 > scrollLeft ? 0 : scrollLeft;
                scrollTop = 0 > scrollTop ? 0 : scrollTop;
                $WRAP.scrollLeft(scrollLeft).scrollTop(scrollTop);
            });
        });
        this.paper.on('blank:pointerup', function (evt, x, y) {
            $PAPER.css('cursor', 'grab');
            $WRAP.off('mousemove');
        });
        this.fitToContent();
    },
    updateFlowOptions: function (flowOptions) {
        const me = this;
        me.graph.clear();
        if (flowOptions) {
            if (flowOptions.nodes && flowOptions.nodes.length > 0) {
                for (let i = 0; i < flowOptions.nodes.length; i++) {
                    const nodeOpt = flowOptions.nodes[i];
                    const node = me.createNode(nodeOpt);
                    me.flow.nodes[nodeOpt.id] = node;
                    node.addTo(me.graph);
                }
            }
            if (flowOptions.links && flowOptions.links.length > 0) {
                for (let i = 0; i < flowOptions.links.length; i++) {
                    const linkOpt = flowOptions.links[i];
                    linkOpt.source = me.flow.nodes[linkOpt.source];
                    linkOpt.target = me.flow.nodes[linkOpt.target];
                    const link = me.createLink(linkOpt);
                    me.flow.links.push(link);
                    link.addTo(me.graph);
                }
            }
        }
        this.fitToContent();
    },
    createNode: function (option) {
        const opt = Object.assign({
                x: 0,
                y: 0,
                width: 38,
                height: 38,
                bodyFillColor: 'white',
                labelText: '节点',
                labelFillColor: 'black'
            }, option),
            textHeight = 38,
            textWidth = PSR.Util.getTextWidth(opt.labelText, PSR.Util.EXT_FONT_ROOT) + 24,
            rect = new joint.shapes.standard.Rectangle({
                position: {x: opt.x, y: opt.y},
                size: {
                    width: Math.max(textWidth, opt.width),
                    height: Math.max(textHeight, opt.height)
                },
                attrs: {
                    body: {
                        fill: opt.bodyFillColor
                    },
                    label: {
                        text: opt.labelText,
                        fill: opt.labelFillColor
                    }
                }
            });
        return rect;
    },
    createLink: function (option) {
        const opt = Object.assign({
            type: 'Link',
            lineColor: 'black'
        }, option);
        return new joint.shapes.standard[opt.type]({
            source: opt.source,
            target: opt.target,
            router: {name: 'metro'},
            attrs: {
                line: {
                    stroke: opt.lineColor
                }
            },
            labels: [{
                position: {
                    distance: 0.5
                },
                attrs: {
                    text: {
                        text: opt.labelText || '',
                        'font-weight': 'bold'
                    }
                }
            }]
        });
    },
    autoLayout: function (option) {
        const opt = Object.assign({
            randDir: this.getLayoutDir(),
            nodeSep: this.getLayoutNodeSep(),
            edgeSep: this.getLayoutEdgeSep()
        }, option);
        joint.layout.DirectedGraph.layout(this.graph, {
            rankDir: opt.rankDir,
            nodeSep: opt.nodeSep,
            edgeSep: opt.edgeSep
        });
        this.fitToContent();
    },
    fitToContent: function () {
        if (this.paper) {
            this.paper.fitToContent({
                padding: 10,
                allowNewOrigin: 'any'
            });
        }
    }
});