function initDesktopEnv(opt) {
    window.clientSite = opt.clientSite;
    window.gatewaySite = opt.gatewaySite;
    window.wsGatewaySite = opt.wsGatewaySite;
    window.moduleSite = opt.moduleSite;

    window.addEventListener("message", function (event) {
        if (window.clientSite.startsWith(event.origin) && event.data === 'login_success') {
            console.log('login message got')
            window.login = true;
        } else if (event.data === 'login_retry') {
            console.log('login retry message got');
            const splash_login = window.document.getElementById("splash-login");
            if (splash_login) {
                splash_login.src = window.clientSite;
            }
        }
        console.log('got message from ' + event.origin + ': ' + event.data);
    }, false);
    document.addEventListener('DOMContentLoaded', function () {
        document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend',
            '\n' +
            '<div id="splash">\n' +
            '    <div class=\"splash-background\" style=\"background-image: url(' + opt.background + ');">\n' +
            '        <div class="splash-login-pos">\n' +
            '            <div class="splash-login-box">\n' +
            '                <div id="splash-loading" style="padding:8px 16px;display: flex;text-align:center;">\n' +
            '                    <div class="fa fa-spinner fa-spin" style="margin:0 6px 0 0;font-size:24px;height: 24px;width: 24px"></div>\n' +
            '                    <div style="font: 600 18px/24px Roboto, sans-serif">&#21152;&#36733;&#20013;...</div>\n' +
            '                </div>\n' +
            '                <iframe allowtransparency="true" frameborder="0" id="splash-login" style="width:100%;height:100%" src="' + window.clientSite + '/"></iframe>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '</div>\n'
        );
        const splash_loading = document.getElementById("splash-loading"),
            splash_login = window.document.getElementById("splash-login");
        splash_login.addEventListener('load', function () {
            splash_loading.style.display = 'none';
        });
    });
}