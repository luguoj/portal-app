import {computed, ref, Ref} from "vue";
import {DataSupplierRaw, ItemOptions} from "../types/LayoutOptions";

export class DataProvider {
    supplierRaw: DataSupplierRaw
    data: Ref<any>

    constructor(supplierRaw: DataSupplierRaw) {
        this.supplierRaw = supplierRaw
        this.data = ref()
        this.update()
        if (supplierRaw.timeout) {
            setInterval(() => this.update(), supplierRaw.timeout)
        }
    }

    update() {
        this.supplierRaw.supplier().then(value => this.data.value = value)
    }
}

export class DataProviderFactory {
    dataSuppliers: Record<string, DataSupplierRaw>
    dataProvider: Record<string, DataProvider>

    constructor(dataSupplierRaws: DataSupplierRaw[]) {
        this.dataSuppliers = {}
        this.dataProvider = {}
        for (const dataSupplierRaw of dataSupplierRaws) {
            this.dataSuppliers[dataSupplierRaw.name] = dataSupplierRaw
        }
    }

    computeData(itemOptions: ItemOptions) {
        const dataProvider = this.getObject(itemOptions.dataProvider)
        if (dataProvider) {
            return computed(() => getTransformFn(itemOptions.dataTransform)(dataProvider.data.value))
        } else {
            return computed(() => undefined)
        }
    }

    private getObject(name?: string): DataProvider | undefined {
        if (name) {
            if (this.dataProvider[name]) {
                return this.dataProvider[name]
            } else {
                return this.dataProvider[name] = new DataProvider(this.dataSuppliers[name])
            }
        }
    }
}


function getTransformFn(transform?: string): (data: any) => any {
    if (transform) {
        try {
            return eval(`(${transform})`)
        } catch (e) {
            console.warn(e)
        }
    }
    return (data: any) => data
}