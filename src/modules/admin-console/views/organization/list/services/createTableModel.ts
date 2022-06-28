import {PsrFilterTreeTableModel} from "@/libs/components/psr/widgets/tree-table/filter/PsrFilterTreeTableModel";
import {NodeData} from "../types";
import {organizationService} from "@/services/organization";
import {buildNodeData} from "./buildNodeData";
import {Ref} from "vue";
import {FilterOptionsBuilder} from "@/libs/services/psr-entity-crud";

export function createTableModel(organizationUseId: Ref<string | undefined>) {
    return PsrFilterTreeTableModel.create<NodeData>({
        loadDataHandler: () => {
            if (organizationUseId.value) {
                return organizationService.crud.organization.findAll(
                    new FilterOptionsBuilder()
                        .field('useId').iEqual(organizationUseId.value)
                        .then().get()
                ).then(data => {
                    return buildNodeData(data.content)
                })
            } else {
                return Promise.resolve([])
            }
        },
        defaultFilters: () => {
            return {
                'code': null,
                'description': null,
                'enabled': null,
                'hierarchyId': null
            }
        }
    })
}