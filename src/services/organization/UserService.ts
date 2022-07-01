import {AxiosInstance} from "axios";
import {UserPersonnelEntity} from "@/services/organization/types";
import {handleErrorMessage, handleRespData} from "@/libs/commons/psr/utils/Axios";

export class UserService {
    private readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client
    }

    findPersonnel(): Promise<UserPersonnelEntity | null> {
        return this._client.get('/user/personnel').then(handleRespData).catch(handleErrorMessage)
    }

    updatePersonnel(userPersonnelEntity: UserPersonnelEntity): Promise<UserPersonnelEntity> {
        return this._client.put('/user/personnel', userPersonnelEntity).then(handleRespData).catch(handleErrorMessage)
    }
}
