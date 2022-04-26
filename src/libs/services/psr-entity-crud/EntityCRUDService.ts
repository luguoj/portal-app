import {AxiosInstance} from "axios";
import {handleErrorMessage, handleRespData} from "@/libs/commons/utils/Axios";

export interface Pageable {
    offset?: number,
    limit?: number,
    sort?: string,
    dir?: 'ASC' | 'DESC',
}

export interface Page<E extends Entity> {
    content: E[],
    totalElements:number,
    totalPages:number,
}

export interface Entity extends Record<string, any> {
    id?: string;
    version?: number;
}

export interface DictionaryEntryEntity extends Entity {
    code?: string
    description?: string
    enabled?: boolean
}

export interface DocumentEntity extends Entity {
    number?: string
    description?: string
    abandoned?: boolean
}


export class EntityCRUDService<E extends Entity> {
    private readonly _client: AxiosInstance;
    private readonly _domainType: string;
    private readonly _contextPath: string;

    constructor(client: AxiosInstance, domainType: string) {
        this._client = client
        this._domainType = domainType
        this._contextPath = `/entity/${domainType}`
    }

    findAllById(ids: string[]): Promise<E[]> {
        return this._client.get(`${this._contextPath}/${ids.join(',')}`).then(handleRespData).catch(handleErrorMessage)
    }

    findAll(filterOptions?: any, pageable?: Pageable): Promise<Page<E>> {
        return this._client.get(`${this._contextPath}`, {
            params: {
                ...pageable,
                filter_options: filterOptions ? JSON.stringify(filterOptions) : null
            }
        }).then(handleRespData).catch(handleErrorMessage)
    }

    create(entity: E): Promise<E> {
        return this._client.post(`${this._contextPath}`, entity).then(handleRespData).catch(handleErrorMessage)
    }

    update(entity: E): Promise<E> {
        return this._client.put(`${this._contextPath}/${entity.id}`, entity).then(handleRespData).catch(handleErrorMessage)
    }

    patch(fields: string[], entity: E): Promise<E> {
        const {id, version} = entity
        const data: Entity = {id, version}
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            data[field] = entity[field]
        }
        return this._client.patch(`${this._contextPath}/${entity.id}/${fields.join(',')}`,
            data
        ).then(handleRespData).catch(handleErrorMessage)
    }

    delete(ids: string[]) {
        return this._client.delete(`${this._contextPath}/${ids.join(',')}`).then(handleRespData).catch(handleErrorMessage)
    }
}