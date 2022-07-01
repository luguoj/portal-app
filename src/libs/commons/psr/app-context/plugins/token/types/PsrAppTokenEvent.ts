import {PsrAppTokenState} from "@/libs/commons/psr/app-context/plugins/token";

export interface PsrAppTokenPrincipalChangeEvent {
    oldState: {
        username: string,
        state: PsrAppTokenState
    },
    newState: {
        username: string,
        state: PsrAppTokenState
    }
}