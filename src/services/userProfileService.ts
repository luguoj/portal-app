import {PsrAppUserProfileService} from "@/libs/commons/psr/app-context/store";
import {appPortalId} from "@/envVariables";
import {useGatewayClient} from "@/services/useGatewayClient";

const ApiClient = useGatewayClient('/portal/api')

function findProfileByPortalId(portalId: string): Promise<any> {
    return ApiClient.get('/user/profile', {params: {portalId: portalId}})
        .then((resp) => {
            if (resp && resp.data) {
                return resp.data
            }
            return ''
        })
}

function updateProfileByPortalId(content: any, portalId: string): Promise<boolean> {
    return ApiClient.put('/user/profile', content, {params: {portalId: portalId}})
        .then(() => true)
}

export const userProfileService: PsrAppUserProfileService = {
    find: () => {
        return findProfileByPortalId(appPortalId)
    },
    update: (content: any) => {
        return updateProfileByPortalId(content, appPortalId)
    }
}