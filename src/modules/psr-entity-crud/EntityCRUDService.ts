import {AxiosInstance, AxiosResponse} from "axios";

function handleResp(resp: AxiosResponse) {
    if (resp && resp.data) {
        return resp.data
    }
    return null
}

interface Page {
    offset?: number,
    limit?: number,
    sort?: string,
    dir?: 'asc' | 'desc',
}

interface Entity extends Record<string, any> {
    id?: string;
    version?: number;
}


export class EntityCRUDService {
    private readonly _client: AxiosInstance;
    private readonly _domainType: string;
    private readonly _contextPath: string;

    constructor(client: AxiosInstance, domainType: string) {
        this._client = client
        this._domainType = domainType
        this._contextPath = `/entity/${domainType}`
    }

    findAllById(ids: string[]): Promise<Entity[]> {
        return this._client.get(`${this._contextPath}/${ids.join(',')}`).then(handleResp)
    }

    findAll(filterOptions?: any, page?: Page): Promise<any> {
        return this._client.get(`${this._contextPath}`, {
            params: {
                ...page,
                filter_options: filterOptions ? JSON.stringify(filterOptions) : null
            }
        }).then(handleResp)
    }

    create(entity: Entity) {
        return this._client.post(`${this._contextPath}`, entity).then(handleResp)
    }

    update(entity: Entity) {
        return this._client.put(`${this._contextPath}/${entity.id}`, entity).then(handleResp)
    }

    patch(fields: string[], entity: Entity) {
        const {id, version} = entity
        const data: Entity = {id, version}
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            data[field] = entity[field]
        }
        return this._client.patch(`${this._contextPath}/${entity.id}/${fields.join(',')}`,
            data
        ).then(handleResp)
    }

    delete(ids: string[]) {
        return this._client.delete(`${this._contextPath}/${ids.join(',')}`).then(handleResp)
    }
}