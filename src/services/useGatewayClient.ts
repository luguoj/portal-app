import axios from "axios";
import {stringify} from "qs";
import {tokenContext} from "@/config/psr-app-context/token";
import {applyTokenInterceptor} from "@/libs/commons/psr/app-context/plugins/token";

export function useGatewayClient(contextPath: string) {
    const client = axios.create({
        baseURL: `${process.env.VUE_APP_PSR_GATEWAY_URL}${contextPath}`,
        paramsSerializer: stringify,
    })
    applyTokenInterceptor(client, tokenContext)
    return client
}