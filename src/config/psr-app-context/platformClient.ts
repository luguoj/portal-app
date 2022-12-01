import {PsrPlatformClient} from "@psr-framework/vue3-plugin-platform-client"

export const platformClient: PsrPlatformClient = new PsrPlatformClient({
    appName: process.env.VUE_APP_NAME,
    tokenService: {
        type: 'sso',
        ssoHost: process.env.VUE_APP_PSR_AUTH_SSO_HOST,
    },
    gatewayHost: process.env.VUE_APP_PSR_GATEWAY_HOST
})