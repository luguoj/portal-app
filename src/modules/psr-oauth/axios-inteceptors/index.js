function useAuthorizationHeader(config, context) {
    if (context.checkToken()) {
        config.headers['Authorization'] = context.authorizationHeader()
        return true
    }
    return false
}

function beforeRequest(config, context) {
    if (useAuthorizationHeader(config, context)) {
        return config
    } else {
        return context.refreshToken().then(() => {
            useAuthorizationHeader(config, context)
            return config
        })
    }
}

function onError(err, context) {
    if (err && err.response) {
        if (err.response.status === 401) {
            return context.refreshToken().then(() => client(err.config))
        }
    }
    return Promise.reject(err)
}

export function withToken(client, tokenService) {
    const context = tokenService.context()
    client.interceptors.request.use(config => beforeRequest(config, context))
    client.interceptors.response.use(undefined, err => onError(err, context))
    return client
}