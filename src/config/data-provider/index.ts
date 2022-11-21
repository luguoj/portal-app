import {DataSupplierRaw} from "@psr-framework/vue3-plugin-dashboard";

export const dataProviders: DataSupplierRaw<any>[] = [{
    name: 'now',
    supplier: () => {
        return Promise.resolve(new Date())
    },
    timeout: 1000
}]