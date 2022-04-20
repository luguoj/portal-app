import {PsrAppTokenService} from "./types/PsrAppTokenService";
import {PsrAppToken} from "./PsrAppToken";
import {usePlugin} from "../../usePlugin";

export const KEY = 'psr-app-context-token'

export function createTokenContext<TS extends PsrAppTokenService>(options: { tokenService: TS }) {
    return new PsrAppToken(KEY, options.tokenService)
}

export function useTokenContext<TS extends PsrAppTokenService>() {
    return usePlugin<PsrAppToken<TS>>(KEY)
}