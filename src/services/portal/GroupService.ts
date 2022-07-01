import {AxiosInstance} from "axios";
import {handleErrorMessage, handleRespData} from "@/libs/commons/psr/utils/Axios";
import {GroupEntity} from "@/services/portal/types";

export class GroupService {
    private readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client
    }

    delete(id: string): Promise<boolean> {
        return this._client.delete(`/group/${id}`)
            .then(() => true).catch(handleErrorMessage)
    }

    clone(id: string): Promise<GroupEntity> {
        return this._client.post('/group/clone', undefined, {params: {id: id}})
            .then(handleRespData).catch(handleErrorMessage)
    }
}
