Ext.define('PSR.view.Loading', {
    extend: 'Ext.Component',
    xtype: 'psr-loading',
    config: {
        src: null
    },
    element: {
        reference: 'element',
        children: [{
            class: 'launching',
            style: "width: 100%; height: 100%; overflow: hidden;",
            children: [{
                style: "margin-top:20%;font-family:Arial;font-size:64px;text-align:center;color:#404040;",
                children: [{
                    html: 'LOADING...'
                }, {
                    tag: 'i',
                    style: "margin:20px;",
                    class: "fa fa-spinner fa-spin"
                }]
            }]
        }]
    }
});
