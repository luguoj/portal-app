import {EntityCRUDService} from "@/libs/services/psr-entity-crud";
import {AxiosInstance} from "axios";
import {DashboardTemplateEntity} from "@/services/portal/types";

const DOMAIN_TYPES = {
    DASHBOARD_TEMPLATE: 'org.psr.platform.portal.entity.DashboardTemplateEntity'
}

export class CRUDService {
    readonly dashboardTemplate: EntityCRUDService<DashboardTemplateEntity>;
    private readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client
        this.dashboardTemplate = new EntityCRUDService<DashboardTemplateEntity>(this._client, DOMAIN_TYPES.DASHBOARD_TEMPLATE)
    }
}

