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
}