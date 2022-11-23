import {PsrVue3PlatformClientPlugin} from "@psr-framework/vue3-plugin-platform-client"

export const platformClient: PsrVue3PlatformClientPlugin = new PsrVue3PlatformClientPlugin({
    appName: process.env.VUE_APP_NAME,
    authorization: {
        type: 'sso',
        ssoHost: process.env.VUE_APP_PSR_AUTH_SSO_HOST,
    },
    gatewayHost: process.env.VUE_APP_PSR_GATEWAY_HOST
})