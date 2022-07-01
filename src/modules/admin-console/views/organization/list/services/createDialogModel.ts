import {PsrCreateUpdateFormDialogModel} from "@/libs/components/psr/dialogs/create-update-form/PsrCreateUpdateFormDialogModel";
import {OrganizationEntity} from "@/services/organization/types";
import {organizationService} from "@/services/organization";
import {Ref} from "vue";

export function createDialogModel(organizationUseId: Ref<string | undefined>, parentId: Ref<string | undefined>) {
    return PsrCreateUpdateFormDialogModel.create<OrganizationEntity>({
        defaultData: () => {
            return {
                id: '',
                version: 0,
                code: '',
                description: '',
                enabled: false,
                useId: organizationUseId.value,
                parentId: parentId.value,
                hierarchyId: '',

            }
        },
        createHandler: (data: OrganizationEntity) => {
            return organizationService.organization.create({
                useId: data.useId!,
                code: data.code!,
                description: data.description!,
                enabled: data.enabled,
                hierarchyId: data.hierarchyId,
                parentId: data.parentId
            })
        },
        updateHandler: (data: OrganizationEntity) => {
            return organizationService.organization.patch(
                data.id!,
                {
                    code: data.code,
                    description: data.description,
                    enabled: data.enabled,
                    hierarchyId: data.hierarchyId,
                    parentId: data.parentId,
                }
            )
        }
    })
}