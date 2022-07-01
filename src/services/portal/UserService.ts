import {AxiosInstance} from "axios";

if (process.env.VUE_APP_PORTAL_ID === undefined) {
    throw new Error("缺少环境变量: process.env.VUE_APP_PORTAL_ID")
}
const appPortalId: string = process.env.VUE_APP_PORTAL_ID

export class UserService {
    private readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client
    }

    findPermissionByPortalId(portalId?: string): Promise<Record<string, Record<string, string[]>>> {
        return this._client.get('/user/permission', {params: {portalId: portalId || appPortalId}})
            .then((resp) => {
                if (resp && resp.data) {
                    return resp.data
                }
                return []
            })
    }

    findProfileByPortalId(portalId?: string): Promise<any> {
        return this._client.get('/user/profile', {params: {portalId: portalId || appPortalId}})
            .then((resp) => {
                if (resp && resp.data) {
                    return resp.data
                }
                return ''
            })
    }

    updateProfileByPortalId(content: any, portalId?: string): Promise<boolean> {
        return this._client.put('/user/profile', content, {params: {portalId: portalId || appPortalId}})
            .then(() => true)
    }
}
