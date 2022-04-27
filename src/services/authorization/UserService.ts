import {AxiosInstance} from "axios";
import {handleErrorMessage, handleRespData} from "@/libs/commons/psr/utils/Axios";

export class UserService {
    private readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client
    }

    resetPassword(id?: string): Promise<string> {
        return this._client.post(`/user/${id}/reset_password`)
            .then(handleRespData).catch(handleErrorMessage)
    }

    delete(id?: string): Promise<boolean> {
        return this._client.delete(`/user/${id}`)
            .then(() => true).catch(handleErrorMessage)
    }
}
