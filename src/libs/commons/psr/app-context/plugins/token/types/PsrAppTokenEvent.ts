import {PsrAppTokenState} from "@/libs/commons/psr/app-context/plugins/token";

export interface PsrAppTokenStateChangeEvent {
    oldState: {
        username: string,
        state: PsrAppTokenState
    },
    newState: {
        username: string,
        state: PsrAppTokenState
    }
}