import {AxiosInstance} from "axios";
import {handleErrorMessage, handleRespData} from "@/libs/commons/psr/utils/Axios";
import {useGatewayClient} from "@/services/useGatewayClient";
import {Entity, Page, Pageable} from "@/libs/services/psr-entity-crud";

export const applications = [{
    name: 'authorization', title: '授权'
}, {
    name: 'portal', title: '门户'
}, {
    name: 'organization', title: '组织'
}, {
    name: 'data-integration', title: '数据集成'
}]

export interface DomainSchema {
    name: string
    title: string
    description: string
    type: string
    format: string
}

export class SchemaService {
    private readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client
    }

    findAllDomainType(application: string): Promise<DomainSchema[]> {
        return this._client.get(`/${application}/api/domain_schema/domain_type`)
            .then(handleRespData).catch(handleErrorMessage)
    }

    findSchemaByDomainType(application: string, domainType: string): Promise<DomainSchema[]> {
        return this._client.get(`/${application}/api/domain_schema/${domainType}`)
            .then(handleRespData).catch(handleErrorMessage)
    }
}

export type CommonEntity = Record<string, any> & Entity

export class CommonEntityCRUDService {
    private readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client
    }

    findAllById(application: string, domainType: string, ids: string[]): Promise<CommonEntity[]> {
        return this._client.get(`/${application}/api/entity/${domainType}/${ids.join(',')}`).then(handleRespData).catch(handleErrorMessage)
    }

    findAll(application: string, domainType: string, filterOptions?: any, pageable?: Pageable): Promise<Page<CommonEntity>> {
        return this._client.get(`/${application}/api/entity/${domainType}`, {
            params: {
                ...pageable,
                filter_options: filterOptions ? JSON.stringify(filterOptions) : null
            }
        }).then(handleRespData).catch(handleErrorMessage)
    }

    create(application: string, domainType: string, entity: CommonEntity): Promise<CommonEntity> {
        return this._client.post(`/${application}/api/entity/${domainType}`, entity).then(handleRespData).catch(handleErrorMessage)
    }

    update(application: string, domainType: string, entity: CommonEntity): Promise<CommonEntity> {
        return this._client.put(`/${application}/api/entity/${domainType}/${entity.id}`, entity).then(handleRespData).catch(handleErrorMessage)
    }

    patch(application: string, domainType: string, fields: (keyof CommonEntity)[], entity: CommonEntity): Promise<CommonEntity> {
        const {id, version} = entity
        const data: CommonEntity = {id, version} as CommonEntity
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            data[field] = entity[field]
        }
        return this._client.patch(`/${application}/api/entity/${domainType}/${entity.id}/${fields.join(',')}`,
            data
        ).then(handleRespData).catch(handleErrorMessage)
    }

    delete(application: string, domainType: string, ids: string[]) {
        return this._client.delete(`/${application}/api/entity/${domainType}/${ids.join(',')}`).then(handleRespData).catch(handleErrorMessage)
    }
}

const ApiClient = useGatewayClient('')
export const entityService = {
    schema: new SchemaService(ApiClient),
    crud: new CommonEntityCRUDService(ApiClient)
}