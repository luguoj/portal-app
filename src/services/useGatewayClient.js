import {withToken} from "@/modules/psr-oauth";
import axios from "axios";
import {stringify} from "qs";
import {tokenService} from "@/services/Authorization";

export function useGatewayClient(options) {
    return withToken(axios.create({
        baseURL: `${process.env.VUE_APP_PSR_GATEWAY_URL}${options.contextPath}`,
        paramsSerializer: stringify,
    }), tokenService)
}