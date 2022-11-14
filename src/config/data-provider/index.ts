import {DataSupplierRaw} from "@/libs/components/psr/widgets/dashboard/types";

export const dataProviders: DataSupplierRaw[] = [{
    name: 'now',
    supplier: () => {
        return Promise.resolve(new Date())
    },
    timeout: 1000
}]