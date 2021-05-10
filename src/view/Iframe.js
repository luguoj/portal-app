Ext.define('PSR.view.Iframe', {
    extend: 'Ext.Component',
    xtype: 'psr-iframe',
    config: {
        src: null
    },
    element: {
        reference: 'element',
        children: [{
            reference: 'iframe',
            scrolling: 'no',
            tag: 'iframe',
            frameborder: "0",
            width: "100%",
            height: "100%",
            listeners: {
                load: 'onLoad',
                error: 'onError',
                pagehide: 'onPageHide',
                hashchange: 'onHashChange'

            }
        }]
    },
    beforeInitialize: function () {
        var me = this;
        me.onLoad = me.onLoad.bind(me);
        me.onError = me.onError.bind(me);
        me.onPageHide = me.onPageHide.bind(me);
        me.onHashChange = me.onHashChange.bind(me);
    },
    afterRender: function () {
        this.iframe.dom.setAttribute('src', Ext.isString(this.getSrc()) ? this.getSrc() : '');
    },
    updateSrc: function (newSrc) {
        if (this.rendered) {
            this.iframe.dom.setAttribute('src', Ext.isString(newSrc) ? newSrc : '');
        }
    },
    onLoad: function (e) {
        this.fireEvent('load', this, e);
    },
    onError: function (e) {
        this.fireEvent('error', this, e);
    },
    onPageHide: function (e) {
        this.fireEvent('pagehide', this, e);
    },
    onHashChange: function (e) {
        this.fireEvent('hashchange', this, e);
    }
});
