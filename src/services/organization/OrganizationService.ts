import {AxiosInstance} from "axios";
import {OrganizationCreationDTO, OrganizationEntity, OrganizationPatchDTO} from "@/services/organization/types";
import {handleErrorMessage, handleRespData} from "@/libs/commons/psr/utils/Axios";

export class OrganizationService {
    private readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client
    }

    create(dto: OrganizationCreationDTO): Promise<OrganizationEntity> {
        return this._client.put('/organization', dto).then(handleRespData).catch(handleErrorMessage)
    }

    delete(id: string): Promise<boolean> {
        return this._client.delete(`/organization/${id}`).then(handleRespData).catch(handleErrorMessage)
    }

    patch(id: string, dto: OrganizationPatchDTO): Promise<OrganizationEntity> {
        return this._client.patch(`/organization/${id}`, dto).then(handleRespData).catch(handleErrorMessage)
    }
}
