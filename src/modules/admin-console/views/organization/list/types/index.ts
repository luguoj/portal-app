import {OrganizationEntity} from "@/services/organization/types";

export interface NodeData {
    id: string,
    code: string,
    description: string,
    enabled: boolean,
    useId: string,
    hierarchyId?: string,
    organization: OrganizationEntity,
    children: NodeData[]
}