import {applyPSROAuthInterceptor} from "@/libs/services/psr-oauth";
import axios from "axios";
import {stringify} from "qs";
import {tokenContext} from "@/token-context";

export function useGatewayClient(contextPath: string) {
    const client = axios.create({
        baseURL: `${process.env.VUE_APP_PSR_GATEWAY_URL}${contextPath}`,
        paramsSerializer: stringify,
    })
    applyPSROAuthInterceptor(client, tokenContext)
    return client
}