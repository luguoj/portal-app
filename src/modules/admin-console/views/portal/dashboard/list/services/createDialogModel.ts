import {PsrCreateUpdateFormDialogModel} from "@/libs/components/psr/dialogs/create-update-form/PsrCreateUpdateFormDialogModel";
import {DashboardTemplateEntity} from "@/services/portal/types";
import {portalService} from "@/services/portal";
import {PORTAL_ID} from "@/modules/admin-console/views/portal/dashboard/list/types";

export function createDialogModel() {
    return PsrCreateUpdateFormDialogModel.create<DashboardTemplateEntity>({
        defaultData: () => {
            return {
                id: '',
                version: 0,
                code: '',
                description: '',
                enabled: false,
                type: 'masonry',
                PORTAL_ID,
                content: ''
            }
        },
        createHandler: (data: DashboardTemplateEntity) => {
            return portalService.crud.dashboardTemplate.create({
                ...data
            })
        },
        updateHandler: (data: DashboardTemplateEntity) => {
            return portalService.crud.dashboardTemplate.patch(
                ['enabled', 'code', 'description'],
                data
            )
        }
    })
}