import {PsrAppPersonalRaw} from "./PsrAppPersonalRaw";

export interface PsrAppPersonalService {
    (username: string): Promise<PsrAppPersonalRaw | undefined>
}