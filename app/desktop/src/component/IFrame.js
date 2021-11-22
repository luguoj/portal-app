Ext.define('PSR.view.IFrame', {
    extend: 'Ext.Component',
    xtype: 'psr-iframe',
    config: {
        src: null
    },
    renderTpl: '<iframe id="{id}-iframeEl"  data-ref="iframeEl" frameborder="0" width="100%" height="100%" ></iframe>',
    childEls: ['iframeEl'],
    afterRender: function () {
        const iframe = this.iframeEl;
        this.mon(iframe, {
            scope: this,
            load: 'onLoad',
            error: 'onError',
            pagehide: 'onPageHide',
            hashchange: 'onHashChange'
        })
        iframe.dom.setAttribute('src', Ext.isString(this.getSrc()) ? this.getSrc() : '');
    },
    updateSrc: function (newSrc) {
        if (this.iframeEl) {
            this.iframeEl.dom.setAttribute('src', Ext.isString(newSrc) ? newSrc : '');
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
    },
    refresh: function () {
        this.iframeEl.dom.setAttribute('src', this.getSrc());
    }
});
