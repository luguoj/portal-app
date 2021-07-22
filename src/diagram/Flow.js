Ext.define('PSR.Diagram.Flow', {
    xtype: 'psr-diagram-flow',
    extend: 'Ext.Container',
    element: {
        reference: 'element',
        children: [{
            reference: 'wrapEl',
            style: 'overflow:auto',
            children: [{
                reference: 'boardEl',
                style: 'padding:20px',
                children: [{
                    reference: 'paperEl'
                }]
            }]
        }]
    },
    config: {
        paperOption: {
            width: 10000,
            height: 10000,
            gridSize: 10,
            background: {
                color: '#fff'
            },
            snapLinks: true,
            restrictTranslate: true,
            drawGrid: {
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
            },
            interactive: {
                elementMove: true
            }
        },
        shapeOptions: [],
        layoutOption: {
            rankDir: 'TB',
            nodeSep: 60,
            edgeSep: 60
        },

    },
    constructor: function (config) {
        const me = this;
        me.graph = new joint.dia.Graph;
        me.callParent([config]);
    },
    afterRender: function () {
        const me = this,
            $WRAP = $(me.wrapEl.dom),
            $PAPER = $(me.paperEl.dom),
            paperOption = Object.assign({
                width: 10000,
                height: 10000,
                gridSize: 10,
                background: {
                    color: '#fff'
                },
                snapLinks: true,
                restrictTranslate: true,
                drawGrid: {
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
                },
                interactive: {
                    elementMove: true
                }
            }, this.getPaperOption());
        paperOption.el = this.paperEl.dom;
        paperOption.model = this.graph;
        this.paper = new joint.dia.Paper(paperOption);
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
    },
    updateShapeOptions: function (shapeOptions) {
        const me = this;
        me.graph.clear();
        me.shapeMap = {}
        if (shapeOptions && shapeOptions.length) {
            for (let i = 0; i < shapeOptions.length; i++) {
                const shapeOption = shapeOptions[i];
                if (shapeOption.id && shapeOption.type
                    && joint.shapes.standard[shapeOption.type]) {
                    me.shapeMap[shapeOption.id] = new joint.shapes.standard[shapeOption.type](shapeOption);
                } else {
                    console.error("invalid shapeOption:" + JSON.stringify(shapeOption));
                }
            }
        }
        this.fitToContent();
    },
    autoLayout: function (option) {
        const layoutOption = Object.assign({
            rankDir: 'TB',
            nodeSep: 60,
            edgeSep: 60
        }, this.getLayoutOption(), option);
        joint.layout.DirectedGraph.layout(this.graph, layoutOption);
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