import {PsrAppPermissionRaw} from "./PsrAppPermissionRaw";

export interface PsrAppPermissionService {
    (username: string): Promise<PsrAppPermissionRaw>
}