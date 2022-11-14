export interface DataSupplierRaw {
    name: string,
    supplier: () => Promise<any>
    timeout?: number
}