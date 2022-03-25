import {AxiosInstance} from "axios";

export class UserService {
    private readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client
    }

    findPermissionByPortalId(portalId: string): Promise<Record<string, string[]>> {
        return this._client.get('/user/permission', {params: {portalId: portalId}})
            .then((resp) => {
                if (resp && resp.data) {
                    return resp.data
                }
                return []
            })
    }
}
