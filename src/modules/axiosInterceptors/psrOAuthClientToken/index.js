import {authorized, refreshToken, authorizationHeader} from "@/services/psrOAuthClient";

function useAuthorizationHeader(config) {
    if (authorized()) {
        config.headers['Authorization'] = authorizationHeader()
        return true
    }
    return false
}

export function withToken(client) {
    function beforeRequest(config) {
        if (useAuthorizationHeader(config)) {
            return config
        } else {
            return refreshToken().then(() => {
                useAuthorizationHeader(config)
                return config
            })
        }
    }

    function onError(err) {
        if (err && err.response) {
            const status = err.response.status
            if (err.response.status === 401) {
                return refreshToken().then(() =>
                    client(err.config)
                )
            }
        }
        return Promise.reject(err)
    }

    client.interceptors.request.use(beforeRequest)
    client.interceptors.response.use(undefined, onError)
    return client
}