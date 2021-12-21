window.portalEnvProd = {
    authclient: 'https://klcappclientsite.king-long.com.cn',
    gateway: 'https://klcgateway.king-long.com.cn',
    wsgateway: 'wss://klcgateway.king-long.com.cn',
    portal: 'https://klc.king-long.com.cn',
    modulecdn: 'https://klc.king-long.com.cn/extmodule/module',
    portalCode: 'portal-platform',
    splashLoginBackground: 'https://klc-test.king-long.com.cn/images/login_bg.jpg',
};
window.portalEnvTest = {
    authclient: 'https://klcappclientsite-test.king-long.com.cn',
    gateway: 'https://klcgateway-test.king-long.com.cn',
    wsgateway: 'wss://klcgateway-test.king-long.com.cn',
    portal: 'https://klc-test.king-long.com.cn',
    modulecdn: 'https://klc-test.king-long.com.cn/extmodule/module',
    portalCode: 'portal-platform',
    splashLoginBackground: 'https://klc-test.king-long.com.cn/images/login_bg.jpg',
};
window.portalEnvDesktopDev = Object.assign({}, window.portalEnvTest, {
    develop: true
});
window.portalEnvPhoneDev = Object.assign({}, window.portalEnvTest, {
    develop: true
});
window.portalEnv = window.portalEnvDesktopDev;
