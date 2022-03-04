import axios from "axios";
import {withToken} from "@/modules/psr-oauth/axios-inteceptors";
import {tokenService} from "@/services/Authorization";

const client = withToken(axios.create({
    baseURL: process.env.VUE_APP_PSR_GATEWAY_URL + '/portal/api'
}), tokenService)

export const ModuleEntity = {
    findAll: () => {
        return client.get('/entity/org.psr.platform.portal.entity.ModuleEntity')
    }
}

export const User = {
    findRoutePermissionByPortalId: (portalId) => {
        return client.get('/user/route_permission', {params: {portalId: portalId}})
            .then((resp) => {
                if (resp && resp.data) {
                    return resp.data
                }
                return []
            })
    }
}

