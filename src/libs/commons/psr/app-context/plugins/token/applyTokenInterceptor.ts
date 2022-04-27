import {AxiosInstance, AxiosRequestConfig} from "axios";
import {PsrAppToken} from "./PsrAppToken";
import {PsrAppTokenService} from "./types/PsrAppTokenService";

function putAuthorizationHeader(config: AxiosRequestConfig, context: PsrAppToken<PsrAppTokenService>) {
    if (context.checkToken()) {
        if (config.headers === undefined) {
            config.headers = {}
        }
        config.headers['Authorization'] = context.authorizationHeader()
        return true
    }
    return false
}

function beforeRequest(config: AxiosRequestConfig, context: PsrAppToken<PsrAppTokenService>) {
    if (putAuthorizationHeader(config, context)) {
        return config
    } else {
        return context.refreshToken().then(() => {
            putAuthorizationHeader(config, context)
            return config
        })
    }
}

function onError(client: AxiosInstance, err: any, context: PsrAppToken<PsrAppTokenService>) {
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

export function applyTokenInterceptor(client: AxiosInstance, context: PsrAppToken<PsrAppTokenService>) {
    client.interceptors.request.use((config: AxiosRequestConfig) => beforeRequest(config, context))
    client.interceptors.response.use(undefined, err => onError(client, err, context))
    return client
}