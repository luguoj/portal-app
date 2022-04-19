import {AxiosInstance, AxiosRequestConfig} from "axios";
import {PSROAuthContext} from "@/libs/services/psr-oauth/context";

function putAuthorizationHeader(config: AxiosRequestConfig, context: PSROAuthContext<TokenService>) {
    if (context.checkToken()) {
        if (config.headers === undefined) {
            config.headers = {}
        }
        config.headers['Authorization'] = context.authorizationHeader()
        return true
    }
    return false
}

function beforeRequest(config: AxiosRequestConfig, context: PSROAuthContext<TokenService>) {
    if (putAuthorizationHeader(config, context)) {
        return config
    } else {
        return context.refreshToken().then(() => {
            putAuthorizationHeader(config, context)
            return config
        })
    }
}

function onError(client: AxiosInstance, err: any, context: PSROAuthContext<TokenService>) {
    if (err && err.response) {
        switch (err.response.status) {
            case 401:
                return context.refreshToken().then(() => client(err.config))
            case 403:
                console.error('无权访问此资源', err)
                break
        }
    }
    return Promise.reject(err)
}

export function applyPSROAuthInterceptor(client: AxiosInstance, context: PSROAuthContext<TokenService>) {
    client.interceptors.request.use((config: AxiosRequestConfig) => beforeRequest(config, context))
    client.interceptors.response.use(undefined, err => onError(client, err, context))
    return client
}