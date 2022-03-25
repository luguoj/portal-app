import {usePSROAuthInterceptor} from "@/libs/services/psr-oauth";
import axios from "axios";
import {stringify} from "qs";
import {tokenContext} from "@/services/Authorization";

export function useGatewayClient(contextPath: string) {
    return usePSROAuthInterceptor(axios.create({
        baseURL: `${process.env.VUE_APP_PSR_GATEWAY_URL}${contextPath}`,
        paramsSerializer: stringify,
    }), tokenContext)
}