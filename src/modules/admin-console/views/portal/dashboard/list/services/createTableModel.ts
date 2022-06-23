import {PsrFilterTreeTableModel} from "@/libs/components/psr/widgets/tree-table/filter/PsrFilterTreeTableModel";
import {NodeData, PORTAL_ID} from "@/modules/admin-console/views/portal/dashboard/list/types";
import {portalService} from "@/services/portal";
import {FilterOptionsBuilder} from "@/libs/services/psr-entity-crud";
import {buildNodeData} from "@/modules/admin-console/views/portal/dashboard/list/services/buildNodeData";

export function createTableModel() {
    return PsrFilterTreeTableModel.create<NodeData>({
        loadDataHandler: () => {
            return portalService.crud.dashboardTemplate.findAll(
                new FilterOptionsBuilder().field('portalId').iEqual(PORTAL_ID).then().get()
            ).then(data => {
                return buildNodeData(data.content)
            })
        },
        defaultFilters: () => {
            return {
                'path': null,
                'description': null,
                'enabled': null,
                'type': null
            }
        }
    })
}