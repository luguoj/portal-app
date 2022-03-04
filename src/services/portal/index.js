import axios from "axios";
import {withToken} from "@/modules/psr-oauth/axios-inteceptors";
import {tokenService} from "@/services/Authorization";

const client = withToken(axios.create({
    baseURL: 'https://klcgateway-test.king-long.com.cn/portal/api'
}), tokenService)

export const ModuleEntity = {
    findAll: () => {
        return client.get('/entity/org.psr.platform.portal.entity.ModuleEntity')
    }
}

export const UserProfile = {
    findPortalProfile: (id) => {
        return client.get(`/user_profile/portal/${id}`)
    },

    findMenuRoutePermission: (id) => {
        return axios.get('./menu_route_permission.json')
            .then((resp) => {
                if (resp && resp.data) {
                    return resp.data
                }
                return []
            })
    }
}

