import {DashboardTemplateEntity} from "@/services/portal/types";
import {NodeData} from "@/modules/admin-console/views/portal/dashboard/list/types";

export function buildNodeData(entities: DashboardTemplateEntity[]): NodeData[] {
    const records: NodeData[] = []
    const recordByPath: Record<string, NodeData> = {}
    let pathIndex = 0
    for (const dashboardTemplateEntity of entities) {
        const pathItems = dashboardTemplateEntity.code!.split('/')
        let fullPath = ''
        let parentPathNode: NodeData | null = null
        for (let i = 0; i < pathItems.length; i++) {
            const pathItem = pathItems[i];
            fullPath += pathItem
            let newParentPathNode = recordByPath[fullPath]
            if (!newParentPathNode) {
                newParentPathNode = recordByPath[fullPath] = {
                    id: 'path-' + pathIndex,
                    path: pathItem,
                    children: []
                }
                if (parentPathNode !== null) {
                    parentPathNode.children.push(newParentPathNode)
                }
                if (i === 0) {
                    records.push(newParentPathNode)
                }
                pathIndex++
            }
            if (i === pathItems.length - 1) {
                newParentPathNode.id = dashboardTemplateEntity.id!
                newParentPathNode.description = dashboardTemplateEntity.description
                newParentPathNode.enabled = dashboardTemplateEntity.enabled
                newParentPathNode.type = dashboardTemplateEntity.type
                newParentPathNode.dashboardTemplate = dashboardTemplateEntity
            }
            parentPathNode = newParentPathNode
        }
    }
    return records
}