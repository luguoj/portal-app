function handleResp(resp) {
    if (resp && resp.data) {
        return resp.data
    }
    return null
}

export class EntityCRUDService {
    constructor(client, domainType) {
        this.client = client
        this.domainType = domainType
        this.contextPath = `/entity/${domainType}`
    }

    findAllById(option) {
        return this.client.get(`${this.contextPath}/${option.ids.join(',')}`
        ).then(handleResp)
    }

    findAll(option) {
        return this.client.get(`${this.contextPath}`, {
            params: {
                offset: option.offset,
                limit: option.limit,
                sort: option.sort,
                dir: option.dir,
                filter_options: JSON.stringify(option.filterOptions)
            }
        }).then(handleResp)
    }

    create(option) {
        return this.client.post(`${this.contextPath}`,
            option.data
        ).then(handleResp)
    }

    update(option) {
        return this.client.put(`${this.contextPath}/${option.data.id}`,
            option.data
        ).then(handleResp)
    }

    patch(option) {
        const {id, version} = option.data
        const data = {id, version}
        for (let i = 0; i < option.fields.length; i++) {
            const field = option.fields[i];
            data[field] = option.data[field]
        }
        return this.client.patch(`${this.contextPath}/${option.data.id}/${option.fields.join(',')}`,
            data
        ).then(handleResp)
    }

    delete(option) {
        return this.client.delete(`${this.contextPath}/${option.ids.join(',')}`,
            option.data
        ).then(handleResp)
    }
}