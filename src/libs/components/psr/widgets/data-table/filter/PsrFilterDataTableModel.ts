import {DataTableFilterMeta} from "primevue/datatable";
import {reactive} from "vue";

export class PsrFilterDataTableModel<E> {
    loadDataHandler: () => Promise<E[]>
    defaultFilters: () => DataTableFilterMeta

    data: E[] = []
    loading: boolean = false
    filters: DataTableFilterMeta

    constructor(
        loadDataHandler: () => Promise<E[]>,
        defaultFilters: () => DataTableFilterMeta
    ) {
        this.loadDataHandler = loadDataHandler
        this.defaultFilters = defaultFilters
        this.filters = defaultFilters()
    }

    static create<E>(
        options: {
            loadDataHandler: () => Promise<E[]>,
            defaultFilters: () => DataTableFilterMeta
        }
    ) {
        return reactive(new PsrFilterDataTableModel(
            options.loadDataHandler,
            options.defaultFilters
        ))
    }

    load() {
        this.loading = true
        return this.loadDataHandler().then(data => {
            this.data = data
        }).finally(() => this.loading = false)
    }

    clearFilters() {
        this.filters = this.defaultFilters()
    }
}