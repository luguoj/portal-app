import {RouteLocationRaw} from "vue-router";
import {BaseError} from "@psr-framework/typescript-utils";

export class PsrAppRouteError extends BaseError {
    redirect?: RouteLocationRaw | Promise<RouteLocationRaw | boolean>

    constructor(msg: string, redirect?: RouteLocationRaw | Promise<RouteLocationRaw | boolean>) {
        super(msg);
        this.redirect = redirect
    }
}