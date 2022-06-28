import {NodeData} from "../types";
import {OrganizationEntity} from "@/services/organization/types";

export function buildNodeData(entities: OrganizationEntity[]): NodeData[] {
    const nodes: NodeData[] = []
    const childNodes: NodeData[] = []
    const nodeById: Record<string, NodeData> = {}
    for (const entity of entities) {
        const node: NodeData = {
            id: entity.id!,
            code: entity.code!,
            description: entity.description!,
            enabled: entity.enabled!,
            useId: entity.useId!,
            hierarchyId: entity.hierarchyId,
            organization: entity,
            children: []
        }
        nodeById[entity.id!] = node
        if (entity.parentId) {
            childNodes.push(node)
        } else {
            nodes.push(node)
        }
    }
    for (const childNode of childNodes) {
        nodeById[childNode.organization.parentId!].children.push(childNode)
    }
    return nodes
}