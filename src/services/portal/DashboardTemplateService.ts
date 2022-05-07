import {AxiosInstance} from "axios";
import {handleErrorMessage} from "@/libs/commons/psr/utils/Axios";

export class DashboardTemplateService {
    private readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client
    }

    delete(id: string): Promise<boolean> {
        return this._client.delete(`/dashboard_template/${id}`)
            .then(() => true).catch(handleErrorMessage)
    }
}
