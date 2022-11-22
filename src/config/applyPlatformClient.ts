import {App} from "vue";
import {psrVue3PlatformClientPlugin, PsrVue3PlatformClientPluginOptions} from "@psr-framework/vue3-plugin-platform-client"

export function applyPlatformClient(app: App) {
    const optionsSSO: PsrVue3PlatformClientPluginOptions = {
        authorization: {
            type: 'sso',
            ssoHost: process.env.VITE_APP_PSR_AUTH_SSO_HOST,
        },
        gatewayHost: process.env.VITE_APP_PSR_GATEWAY_HOST
    }
    app.use(psrVue3PlatformClientPlugin(process.env.VITE_APP_NAME), optionsSSO)
}