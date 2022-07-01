import {AxiosInstance} from "axios";
import {UserPersonnelEntity} from "@/services/organization/types";

export class UserService {
    private readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client
    }

    findPersonnel(): Promise<UserPersonnelEntity | null> {
        return this._client.get('/user/personnel')
            .then((resp) => {
                if (resp && resp.data) {
                    return resp.data
                }
                return null
            })
    }

    updatePersonnel(userPersonnelEntity: UserPersonnelEntity): Promise<UserPersonnelEntity> {
        return this._client.put('/user/personnel', userPersonnelEntity)
            .then((resp) => {
                if (resp && resp.data) {
                    return resp.data
                }
                return null
            })
    }
}
