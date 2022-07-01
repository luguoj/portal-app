import {RouteLocationRaw} from "vue-router";
import {BaseError} from "@/libs/commons/psr/utils/BaseError";

export class PsrAppRouteError extends BaseError {
    redirect?: RouteLocationRaw | Promise<RouteLocationRaw | boolean>

    constructor(msg: string, redirect?: RouteLocationRaw | Promise<RouteLocationRaw | boolean>) {
        super(msg);
        this.redirect = redirect
    }
}