import {PsrAppPermissionService} from "@/libs/commons/psr/app-context";
import {useGatewayClient} from "@/services/useGatewayClient";
import {appPortalId} from "@/envVariables";

const ApiClient = useGatewayClient('/portal/api')

function findPermissionByPortalId(portalId: string): Promise<Record<string, Record<string, string[]>>> {
    return ApiClient.get('/user/permission', {params: {portalId: portalId}})
        .then((resp) => {
            if (resp && resp.data) {
                return resp.data
            }
            return []
        })
}

export const permissionService: PsrAppPermissionService = (username) => {
    if (username === 'platform_admin') {
        return Promise.resolve('permit-all')
    } else {
        return findPermissionByPortalId(appPortalId)
    }
}