import {AxiosInstance} from "axios";

export class UserService {
    private readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client
    }

    resetPassword(id?: string): Promise<string> {
        return this._client.post(`/user/${id}/reset_password`)
            .then((resp) => {
                if (resp && resp.data) {
                    return resp.data
                }
                return ''
            })
    }

    delete(id?: string): Promise<boolean> {
        return this._client.delete(`/user/${id}`)
            .then(() => true)
    }
}
